const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed.";

    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function listTasks() {
  return request("/tasks");
}

export function createTask(payload) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTask(id, payload) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
}
