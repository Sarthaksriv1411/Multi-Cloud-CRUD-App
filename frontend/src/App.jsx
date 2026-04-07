import { useEffect, useMemo, useState } from "react";

import { createTask, deleteTask, listTasks, updateTask } from "./api";

const initialForm = {
  title: "",
  description: "",
  status: "Pending"
};

const statusOptions = ["Pending", "In Progress", "Completed"];

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function refreshTasks() {
    setLoading(true);
    setError("");

    try {
      const items = await listTasks();
      setTasks(items);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshTasks();
  }, []);

  const summary = useMemo(
    () =>
      tasks.reduce(
        (accumulator, task) => {
          accumulator.total += 1;

          if (task.status === "Pending") {
            accumulator.pending += 1;
          }

          if (task.status === "In Progress") {
            accumulator.inProgress += 1;
          }

          if (task.status === "Completed") {
            accumulator.completed += 1;
          }

          return accumulator;
        },
        {
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0
        }
      ),
    [tasks]
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await updateTask(editingId, form);
      } else {
        await createTask(form);
      }

      resetForm();
      await refreshTasks();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(task) {
    setEditingId(task._id);
    setForm({
      title: task.title,
      description: task.description || "",
      status: task.status
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this task?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteTask(id);

      if (editingId === id) {
        resetForm();
      }

      await refreshTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleQuickComplete(task) {
    setError("");

    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description || "",
        status: task.status === "Completed" ? "Pending" : "Completed"
      });

      if (editingId === task._id) {
        setForm((current) => ({
          ...current,
          status: task.status === "Completed" ? "Pending" : "Completed"
        }));
      }

      await refreshTasks();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="page-shell">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <main className="app-shell">
        <section className="hero">
          <p className="eyebrow">Deploy-ready local MVP</p>
          <h1>Task Manager CRUD App</h1>
          <p className="hero-copy">
            Add tasks, view progress, update task state, and delete completed
            work through a simple full-stack app backed by MongoDB.
          </p>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <span>Total Tasks</span>
            <strong>{summary.total}</strong>
          </article>
          <article className="summary-card">
            <span>Pending</span>
            <strong>{summary.pending}</strong>
          </article>
          <article className="summary-card">
            <span>In Progress</span>
            <strong>{summary.inProgress}</strong>
          </article>
          <article className="summary-card">
            <span>Completed</span>
            <strong>{summary.completed}</strong>
          </article>
        </section>

        <section className="layout-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">
                  {editingId ? "Update task" : "Add task"}
                </p>
                <h2>{editingId ? "Edit task details" : "Create a new task"}</h2>
              </div>
              {editingId ? (
                <button className="ghost-button" onClick={resetForm} type="button">
                  Cancel edit
                </button>
              ) : null}
            </div>

            <form className="workload-form" onSubmit={handleSubmit}>
              <label className="full-width">
                <span>Title</span>
                <input
                  name="title"
                  onChange={updateField}
                  placeholder="Finish backend API"
                  required
                  value={form.title}
                />
              </label>

              <label className="full-width">
                <span>Description</span>
                <textarea
                  name="description"
                  onChange={updateField}
                  placeholder="Optional notes for the task."
                  rows="4"
                  value={form.description}
                />
              </label>

              <label className="full-width">
                <span>Status</span>
                <select name="status" onChange={updateField} value={form.status}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <button className="primary-button" disabled={saving} type="submit">
                {saving ? "Saving..." : editingId ? "Update task" : "Add task"}
              </button>
            </form>
          </section>

          <section className="panel">
            <div className="panel-head">
              <div>
                <p className="panel-label">Task List</p>
                <h2>View tasks</h2>
              </div>
              <button className="ghost-button" onClick={refreshTasks} type="button">
                Refresh
              </button>
            </div>

            {error ? <p className="feedback error">{error}</p> : null}
            {loading ? <p className="feedback">Loading tasks...</p> : null}

            {!loading && tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet.</p>
                <span>Add your first task to test the CRUD flow.</span>
              </div>
            ) : null}

            <div className="card-stack">
              {tasks.map((task) => (
                <article className="workload-card" key={task._id}>
                  <div className="workload-card__head">
                    <div>
                      <h3>{task.title}</h3>
                      <p>
                        Created{" "}
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        }).format(new Date(task.createdAt))}
                      </p>
                    </div>
                    <span className={`status-pill status-${task.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {task.status}
                    </span>
                  </div>

                  <p className="description-text">
                    {task.description || "No description added for this task."}
                  </p>

                  <div className="meta-grid task-meta-grid">
                    <div>
                      <span>Last Updated</span>
                      <strong>
                        {new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        }).format(new Date(task.updatedAt))}
                      </strong>
                    </div>
                    <div>
                      <span>Status</span>
                      <strong>{task.status}</strong>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="ghost-button"
                      onClick={() => handleEdit(task)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="ghost-button"
                      onClick={() => handleQuickComplete(task)}
                      type="button"
                    >
                      {task.status === "Completed" ? "Mark pending" : "Mark complete"}
                    </button>
                    <button
                      className="danger-button"
                      onClick={() => handleDelete(task._id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
