const state = {
  dispatcherToken: "",
  masterToken: ""
};

const alertBox = document.getElementById("alertBox");

function showAlert(type, message) {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function hideAlert() {
  alertBox.classList.add("d-none");
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Ошибка запроса");
  }

  return data;
}

function toStatusPill(status) {
  return `<span class="status-pill">${status}</span>`;
}

document.getElementById("createRequestForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const created = await requestJson("/requests", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    showAlert("success", `Заявка #${created.id} создана.`);
    event.target.reset();
  } catch (error) {
    showAlert("danger", error.message);
  }
});

document.getElementById("dispatcherLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);

  try {
    const { token } = await requestJson("/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    state.dispatcherToken = token;
    showAlert("success", "Диспетчер авторизован.");
  } catch (error) {
    showAlert("danger", error.message);
  }
});

document.getElementById("masterLoginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);

  try {
    const { token } = await requestJson("/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    state.masterToken = token;
    showAlert("success", "Мастер авторизован.");
  } catch (error) {
    showAlert("danger", error.message);
  }
});

async function loadDispatcherRequests() {
  hideAlert();

  if (!state.dispatcherToken) {
    showAlert("warning", "Сначала войдите как диспетчер.");
    return;
  }

  const status = document.getElementById("dispatcherStatus").value;
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  try {
    const requests = await requestJson(`/requests${query}`, {
      headers: {
        Authorization: `Bearer ${state.dispatcherToken}`
      }
    });

    const tbody = document.querySelector("#dispatcherTable tbody");
    tbody.innerHTML = "";

    requests.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.clientname ?? item.clientName}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>${toStatusPill(item.status)}</td>
        <td>${item.assignedto ?? item.assignedTo ?? "—"}</td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary assign-btn" data-id="${item.id}">назначить мастера</button>
            <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${item.id}">отменить</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    showAlert("danger", error.message);
  }
}

async function loadMasterRequests() {
  hideAlert();

  if (!state.masterToken) {
    showAlert("warning", "Сначала войдите как мастер.");
    return;
  }

  try {
    const requests = await requestJson("/requests/my", {
      headers: {
        Authorization: `Bearer ${state.masterToken}`
      }
    });

    const tbody = document.querySelector("#masterTable tbody");
    tbody.innerHTML = "";

    requests.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.clientname ?? item.clientName}</td>
        <td>${item.address}</td>
        <td>${item.problemtext ?? item.problemText}</td>
        <td>${toStatusPill(item.status)}</td>
        <td>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-success start-btn" data-id="${item.id}">Взять в работу</button>
            <button class="btn btn-sm btn-outline-secondary finish-btn" data-id="${item.id}">Завершить</button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    showAlert("danger", error.message);
  }
}

document.getElementById("loadDispatcherRequests").addEventListener("click", loadDispatcherRequests);
document.getElementById("dispatcherStatus").addEventListener("change", loadDispatcherRequests);
document.getElementById("loadMasterRequests").addEventListener("click", loadMasterRequests);

document.addEventListener("click", async (event) => {
  const assignBtn = event.target.closest(".assign-btn");
  const cancelBtn = event.target.closest(".cancel-btn");
  const startBtn = event.target.closest(".start-btn");
  const finishBtn = event.target.closest(".finish-btn");

  try {
    if (assignBtn) {
      const id = assignBtn.dataset.id;
      const masterId = prompt("Введите ID мастера:");

      if (!masterId) {
        return;
      }

      await requestJson(`/requests/${id}/assign`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.dispatcherToken}`
        },
        body: JSON.stringify({ masterId: Number(masterId) })
      });

      showAlert("success", `Мастер ${masterId} назначен на заявку #${id}.`);
      await loadDispatcherRequests();
    }

    if (cancelBtn) {
      const id = cancelBtn.dataset.id;

      await requestJson(`/requests/${id}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.dispatcherToken}`
        }
      });

      showAlert("success", `Заявка #${id} отменена.`);
      await loadDispatcherRequests();
    }

    if (startBtn) {
      const id = startBtn.dataset.id;

      await requestJson(`/requests/${id}/start`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.masterToken}`
        }
      });

      showAlert("success", `Заявка #${id} взята в работу.`);
      await loadMasterRequests();
    }

    if (finishBtn) {
      const id = finishBtn.dataset.id;

      await requestJson(`/requests/${id}/finish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${state.masterToken}`
        }
      });

      showAlert("success", `Заявка #${id} завершена.`);
      await loadMasterRequests();
    }
  } catch (error) {
    showAlert("danger", error.message);
  }
});
