(function () {
  "use strict";

  const STORAGE_KEY = "todo-tasks-v1";

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const emptyMsg = document.getElementById("empty-msg");

  /** @type {{id: string, text: string, done: boolean}[]} */
  let tasks = loadTasks();

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("No se pudieron cargar las tareas:", err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("No se pudieron guardar las tareas:", err);
    }
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function render() {
    list.innerHTML = "";

    tasks.forEach(function (task) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", function () {
        task.done = checkbox.checked;
        saveTasks();
        render();
      });

      const text = document.createElement("span");
      text.textContent = task.text;

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "delete-btn";
      delBtn.textContent = "Eliminar";
      delBtn.addEventListener("click", function () {
        tasks = tasks.filter(function (t) {
          return t.id !== task.id;
        });
        saveTasks();
        render();
      });

      li.append(checkbox, text, delBtn);
      list.appendChild(li);
    });

    emptyMsg.hidden = tasks.length > 0;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ id: createId(), text: text, done: false });
    saveTasks();
    input.value = "";
    input.focus();
    render();
  });

  render();
})();
