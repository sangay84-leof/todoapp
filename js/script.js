const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAll");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Add Task */
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ id: Date.now(), text, completed: false });
  taskInput.value = "";

  saveTasks();
  renderTasks();
}

/* Delete Task */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

/* Toggle Task */
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
  saveTasks();
  renderTasks();
}

/* Render Tasks */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<p style='text-align:center;'>No tasks available</p>";
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} task(s)`;
}

/* Save to localStorage */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Filter Tasks */
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filters .active").classList.remove("active");
    btn.classList.add("active");

    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* Clear All */
clearAllBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

/* Events */
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

/* Initial Render */
renderTasks();
