'use strict';
//clear local storag
// localStorage.clear()

///////////////////////
//Selecting elements//
/////////////////////
const form = document.querySelector('.todo__form');
const addBtn = document.querySelector('#add');
const taskInput = document.querySelector('.todo__input');
const listTasks = document.querySelector('.list-tasks');
const filterTask = document.querySelectorAll('.filters span');
const itemLeft = document.querySelector('.item__left');
const footer = document.querySelector('#footer');
const clearCompletedBtn = document.querySelector('#clear-btn');
// Create Arr to tasks
let tasksList = [];
// Listen tasks from the local storage
tasksList = JSON.parse(localStorage.getItem("tasks"));
// for edit task
let idEdit;
let isIdEdit = false;
// Stop displayin footer when load document
footer.style.display = "none";

// Add event listener for input button and call the add task function
addBtn.addEventListener("click", addTask);
// Add event listener for clear completed tasks and call the function
clearCompletedBtn.addEventListener("click", deleteTaskCompleted);
// Filter tasks
filterTask.forEach(e => {
  e.addEventListener('click', () => {
    document.querySelector('span.selected').classList.remove('selected');
    e.classList.add('selected');
    // Diplay footer when we have a task
    footer.style.display = "flex";
    renderTasks(e.id);
  });
});

function renderTasks(filter) {
  let html = "";
  if (tasksList) {
    // displa footer when we have tasks
    footer.style.display = "flex";
    tasksList.forEach((task, id) => {
      let completedTask = task.status == "completed" ? "checked" : "";
      if (filter == task.status || filter == 'all') {
        // Create task div
        html +=
          `
        <div class="task" id="${id}"><label class="check-btn"><input type="checkbox" id=${id} onclick="changeStatus(this) "${completedTask}><span class="checkbox"></span>
        <li class="task-item ${completedTask}">${task.name}</li>
        </label>
        <button class="edit-btn" onclick="editTask(${id}, '${task.name}')">📝</button>
        <button class="delete-btn" onclick="deleteTask(${id})">❌</button>
        </div>
        `;
      }
    });
  }
  if (tasksList == '') {
    // Stop displayin footer when load document
    footer.style.display = "none";
  }
  listTasks.innerHTML = html || `<li class="task">The list is empty :-)</li>`;
  taskInput.value = '';

};
renderTasks('all');
// Calc the number of incomplete tasks 
function numberitemsLeft() {
  let html = "";
  if (tasksList) {
    const tasksActive = tasksList.filter((task, i) => {
      return task.status === 'active';
    })
    html = `<span>${tasksActive.length} items left</span>`;
  };
  itemLeft.innerHTML = html;
};
numberitemsLeft();
// Change status: completed and active
function changeStatus(checkedTask) {
  let task = checkedTask.parentElement.lastElementChild;
  if (checkedTask.checked) {
    task.classList.add("checked");
    tasksList[checkedTask.id].status = "completed";
    numberitemsLeft();

  };
  if (!checkedTask.checked) {
    task.classList.remove("checked");
    tasksList[checkedTask.id].status = "active";
    numberitemsLeft();

  };
  localStorage.setItem("tasks", JSON.stringify(tasksList));
};
// Function for edit task
function editTask(idTask, nameTask) {
  idEdit = idTask;
  isIdEdit = true;
  taskInput.value = nameTask;
};
// Function for delete task
function deleteTask(dltTaske) {
  tasksList.splice(dltTaske, 1);
  localStorage.setItem("tasks", JSON.stringify(tasksList));
  renderTasks('all');
  numberitemsLeft();
};
// Function for delete completed task
function deleteTaskCompleted() {
  if (tasksList) {
    const tasksCompleted = tasksList.filter((task) => {
      return task.status !== 'completed';
    })
    tasksList = tasksCompleted
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    renderTasks('all');
    document.getElementById('completed').classList.remove('selected');
    document.getElementById('active').classList.remove('selected');
    document.getElementById('all').classList.add('selected');
    numberitemsLeft();
  };
};


function addTask(event) {
  event.preventDefault();
  let task = taskInput.value.trim();
  if (task) {
    if (!isIdEdit) {
      if (!tasksList) {
        tasksList = [];
      };
      let taskItem = { name: task, status: "active" };
      tasksList.push(taskItem);
    }
    if (isIdEdit) {
      isIdEdit = false;
      tasksList[idEdit].name = task;
    }
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    renderTasks('all');
  };
  numberitemsLeft();
};