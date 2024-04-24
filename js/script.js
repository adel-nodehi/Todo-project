'use strict';

// create listData in local storage if it's not already there
localStorage.getItem('listData') ||
  localStorage.setItem('listData', JSON.stringify(todoDatas));

// fetch data from local storage
let todoDatas = JSON.parse(localStorage.getItem('listData'));

// Selecting the elements
const listContainer = document.querySelector('.todo__list-container');
const input = document.querySelector('.todo__input');
const taskCount = document.querySelector('.todo__reminde-number');
const btnContainer = document.querySelector('.todo__list-buttons');
const btnClear = document.querySelector('.todo__clear-btn');

let taskFilter = null;

// Function
const showData = function () {
  listContainer.innerHTML = '';
  todoDatas.forEach(function (data, i) {
    const mustShowed = taskFilter === null || data.state === taskFilter;

    if (!mustShowed) return;

    const checked = data.state === 'completed' ? 'todo__item--checked' : '';

    const html = `<div class="todo__list-item ${checked}" data-index=${i}>
        <div class="todo__content-wrapper">
          <div class="todo__item-circle">
            <img
              class="todo__item-circle-img"
              src="./images/icon-check.svg"
              alt="check icon"
            />
          </div>
      
          <p class="todo__item-content">
            ${data.content}
          </p>
        </div>
        <button class="todo__item-close">
          <img
            class="todo__close-img"
            src="./images/icon-cross.svg"
            alt="close"
          />
        </button>
      </div>`;
    listContainer.insertAdjacentHTML('afterbegin', html);
  });

  taskCount.textContent = `${
    todoDatas.filter(data => data.state === 'active').length
  } item left`;

  // save to local storage
  localStorage.setItem('listData', JSON.stringify(todoDatas));
};
showData();

// add task
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && input.value !== '') {
    const newTask = {
      content: `${input.value}`,
      state: 'active',
    };
    input.value = '';

    todoDatas.push(newTask);
    showData();
  } else {
    alert("Task content can't be empty.");
  }
});

// complited
listContainer.addEventListener('click', function (e) {
  const task = e.target.closest('.todo__list-item');

  if (e.target.closest('.todo__item-close')) {
    todoDatas.splice(task.dataset.index, 1);
    showData();
  }

  if (
    e.target.closest('.todo__item-circle') ||
    e.target.closest('.todo__item-content')
  ) {
    const currentTask = todoDatas[task.dataset.index];
    currentTask.state === 'completed'
      ? (currentTask.state = 'active')
      : (currentTask.state = 'completed');
    showData();
  }
});

// Filter
const activateFilterBtn = function (clickedBtn) {
  [...btnContainer.children].forEach(btn =>
    btn.classList.remove('todo__btn--active')
  );
  clickedBtn.classList.add('todo__btn--active');
};

btnContainer.addEventListener('click', function (e) {
  if (e.target.closest('.btn__all')) {
    taskFilter = null;
    activateFilterBtn(e.target);
    showData();
  }
  if (e.target.closest('.btn__active ')) {
    taskFilter = 'active';
    activateFilterBtn(e.target);

    showData();
  }
  if (e.target.closest('.btn__completed')) {
    taskFilter = 'completed';
    activateFilterBtn(e.target);
    showData();
  }
});

// Clear completed
btnClear.addEventListener('click', function () {
  todoDatas = todoDatas.filter(data => data.state !== 'completed');
  showData();
});
