// Seleção de Elementos
const menuBtn = document.querySelector("#fab");
const options = document.querySelector("#options");
const clockBtn = document.querySelector("#clock-button");

const toolbarForm = document.querySelector("#toolbar-form");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editDesc = document.querySelector("#description");
const editStart = document.querySelector("#time-start");
const editEnd = document.querySelector("#time-end");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const progressBar = document.querySelector("#progress-bar");
const todoStates = document.querySelector("#todo-states")

const modal = document.querySelector("#modal");
const accept = document.querySelector("#confirm");

var inProgress = true;
var progressInterval;
var width = 1;
var startedProgress = false;

let oldInputValue;
let oldDescValue;
let oldStartValue;
let oldEndValue;
options.classList.toggle("hidden-menu");

document.addEventListener("DOMContentLoaded", function() {
    updateTaskStatus()
});

// Funções
const toggleMenu = () => {
    options.style.setProperty("transition", "2s");
    options.classList.toggle("hidden-menu");
};

const saveTodo = (validatedTitle) => {

    const collapsible = document.createElement("div")
    collapsible.classList.add("collapsible")

    const todo = document.createElement("div")
    todo.classList.add("todo")
    collapsible.appendChild(todo)

    const title = document.createElement("div")
    title.classList.add("title")
    todo.appendChild(title);

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-caret-right");
    icon.style.display = "none"
    title.appendChild(icon);

    const todoTitle = document.createElement("h3")
    todoTitle.innerHTML = validatedTitle;
    title.appendChild(todoTitle);

    const buttonsTodo = document.createElement("div");
    buttonsTodo.classList.add("buttons-todo")
    todo.appendChild(buttonsTodo);

    const buttonsOptions = document.createElement("div");
    buttonsOptions.classList.add("buttons-options")
    buttonsTodo.appendChild(buttonsOptions);

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    buttonsOptions.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    buttonsOptions.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    buttonsOptions.appendChild(deleteBtn)

    const buttonsProgress = document.createElement("div");
    buttonsProgress.classList.add("button-progress")
    buttonsTodo.appendChild(buttonsProgress)

    const progressBtn = document.createElement("button")
    progressBtn.classList.add("progress-todo")
    progressBtn.innerHTML = '<i class="fa-solid fa-play"></i>'
    buttonsProgress.appendChild(progressBtn)

    const infoTodo = document.createElement("div");
    infoTodo.classList.add("info-todo")
    todo.appendChild(infoTodo)

    const tag = document.createElement("h6")
    tag.setAttribute("data-value", "todo")
    tag.textContent = "Pendentes"
    infoTodo.appendChild(tag)

    const time = document.createElement("div");
    time.classList.add("time")
    infoTodo.appendChild(time)

    const timeStart = document.createElement("p");
    timeStart.classList.add("time-start");
    time.appendChild(timeStart);

    const timeText = document.createElement("p");
    timeText.classList.add("time-text");
    timeText.innerText = 'às';
    time.appendChild(timeText)
    timeText.style.display = 'none';

    const timeEnd = document.createElement("p");
    timeEnd.classList.add("time-end");
    time.appendChild(timeEnd)

    const progressBar = document.createElement("div");
    progressBar.setAttribute("id", "progress-bar")
    progressBar.classList.add("progress-bar");
    infoTodo.appendChild(progressBar)

    const progress = document.createElement("div");
    progress.classList.add("progress");
    progressBar.appendChild(progress)

    const descTodo = document.createElement("div");
    descTodo.setAttribute("id", "desc-todo");
    descTodo.classList.add("desc-todo");
    todo.appendChild(descTodo)

    const description = document.createElement("p");
    description.classList.add("description");
    descTodo.appendChild(description)

    todoList.appendChild(collapsible);

    todoInput.value = "";
    todoInput.focus();

    updateTaskStatus()
    searchTasks();
};

const titleValidation = (title) => {
    let regexp = /^\s+$/;

    title = title.match(regexp) || title == '' ? "Sem titulo" : title.trim();

    return title;
};

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
    toolbarForm.classList.toggle("hide")
    todoStates.classList.toggle("hide")
};

const updateTodo = async (title, start, end, desc) => {
    const todosTitles = document.querySelectorAll(".title");
    const todosTimes = document.querySelectorAll(".info-todo");
    const todosDescs = document.querySelectorAll(".desc-todo");

    todosTitles.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");
        let icon = todo.querySelector("i");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = title;

            if (icon && desc.trim() === "") {
                icon.style.display = "none";
            } else if (icon) {
                icon.style.display = "flex";
            }
        }
    });

    todosTimes.forEach(async (todo) => {
        let todoStart = todo.querySelector(".time-start");
        let todoEnd = todo.querySelector(".time-end");
        let timeText = todo.querySelector(".time-text");

        if (todoStart && todoStart.getAttribute("value") === oldStartValue) {
            const dateObjStart = createDateObject(start);
            const hourStart = dateObjStart ? dateObjStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            todoStart.setAttribute("value", start);
            todoStart.innerHTML = hourStart;
        }

        if (todoEnd && todoEnd.getAttribute("value") === oldEndValue) {
            const dateObjEnd = createDateObject(end);
            const hourEnd = dateObjEnd ? dateObjEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            todoEnd.setAttribute("value", end);
            todoEnd.innerHTML = hourEnd;
        }

        if ((todoEnd && todoEnd.innerHTML) || (todoStart && todoStart.innerHTML)) {
            timeText.style.display = "flex";
        } else {
            timeText.style.display = 'none';
        }
    });

    todosDescs.forEach((todo) => {
        let todoDesc = todo.querySelector(".description");

        if (todoDesc && todoDesc.innerText === oldDescValue) {
            todoDesc.innerHTML = desc;
        }
    });

    updateTaskStatus();
};

// Eventos
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let inputValue = todoInput.value;

    if(inputValue) {
        let validatedInput = await titleValidation(inputValue);
        saveTodo(validatedInput)
    }
});

function updateTaskStatus() {
    const currentTime = new Date().getTime();
    const collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach(collapsible => {
        const timeStartElement = collapsible.querySelector(".time-start").getAttribute("value");
        const tagElement = collapsible.querySelector(".info-todo h6");
        const finishTodoButton = collapsible.querySelector('.finish-todo');

        if (timeStartElement && tagElement) {
            const timeStart = new Date(timeStartElement).getTime();

            if (currentTime > timeStart && tagElement.dataset.value === "todo") {
                updateTaskToOverdue(collapsible, tagElement);
            }
        }

        if (finishTodoButton) {
            finishTodoButton.addEventListener('click', () => {
                toggleTaskDoneStatus(collapsible, tagElement);
                verifyStateTodoByButton(tagElement.dataset.value, finishTodoButton);
                filterTasks();
            });
        }

        moveTaskToStateContainer(collapsible, tagElement);

        collapsible.addEventListener("click", showAndHideDescription);
    });

    function updateTaskToOverdue(collapsible, tagElement) {
        tagElement.textContent = "Atrasados";
        tagElement.setAttribute("data-value", "overdue");
        collapsible.classList.add("overdue");
    }

    function toggleTaskDoneStatus(collapsible, tagElement) {
        const isDone = collapsible.classList.toggle("done");

        if (isDone) {
            tagElement.textContent = "Concluídos";
            tagElement.setAttribute("data-value", "done");
        } else {
            collapsible.classList.remove("overdue");
            tagElement.textContent = "Pendentes";
            tagElement.setAttribute("data-value", "todo");
            updateTaskToOverdue(collapsible, tagElement);
        }
    }

    function moveTaskToStateContainer(collapsible, tagElement) {
        const stateCollapsible = tagElement.dataset.value;
        const stateZ = stateCollapsible + '-state';
        const targetDiv = document.querySelector('.' + stateZ);

        if (targetDiv && targetDiv.className == stateZ) {
            targetDiv.appendChild(collapsible);
        }
    }

    function showAndHideDescription(event) {
        const isButton = event.target.closest(".buttons-todo button");

        if (!isButton) {
            const collapsible = event.currentTarget;
            collapsible.classList.toggle("active");

            const content = collapsible.querySelector(".desc-todo");
            content.style.display = content.style.display === "flex" ? "none" : "flex";

            const icon = collapsible.querySelector(".title i");
            collapsible.classList.contains("active") ? icon.className = 'fa-solid fa-caret-down' : icon.className = 'fa-solid fa-caret-right';
        }
    }

    function verifyStateTodoByButton(state, button) {
        const targetDiv = document.querySelector('.'+state+'-state');
        const collapsibleDiv = button.closest('.collapsible');
        targetDiv.appendChild(collapsibleDiv);
    }
}

function createDateObject(dateString) {
    if (!dateString) {
        return null; //caso esteja vazia ou nula
    }

    const dateObj = new Date(dateString);

    return isNaN(dateObj) ? null : dateObj;
}

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest(".collapsible");
    let todoTitle, timeStart, timeEnd, description;

    if(parentElement && parentElement.querySelector("h3")) {
        todoTitle = parentElement.querySelector("h3").innerHTML
    }

    if(parentElement && parentElement.querySelector(".time-start")) {
        timeStart = parentElement.querySelector(".time-start").getAttribute("value");
    }

    if(parentElement && parentElement.querySelector(".time-end")) {
        timeEnd = parentElement.querySelector(".time-end").getAttribute("value");
    }

    if(parentElement && parentElement.querySelector(".description")) {
        description = parentElement.querySelector(".description").innerHTML
    }

    if(targetElement.classList.contains("remove-todo")) {
        modal.style.display = "block";

        accept.addEventListener("click", (e) => {
            const collapsibleToRemove = targetElement.closest(".collapsible")

            if (collapsibleToRemove) {
                collapsibleToRemove.remove();
                modal.style.display = "none";
            }
        });

    } else {
        modal.style.display = "none";
    }

    if(targetElement.classList.contains("edit-todo")) {
        toggleForms()

        editInput.value = todoTitle;
        oldInputValue = todoTitle;

        editStart.value = timeStart;
        console.log(editStart.value)
        oldStartValue = timeStart;

        editEnd.value = timeEnd;
        oldEndValue = timeEnd;

        if (timeStart == '') {
            editStart.value = timeEnd;
            oldEndValue = timeEnd;
        } else if (timeStart > timeEnd) {
            editEnd.value = timeStart;
            oldStartValue = timeEnd;
        }

        editDesc.value = description;
        oldDescValue = description;
    }

    if(targetElement.classList.contains("progress-todo")){
        const changeIcon = parentElement.querySelector("button.progress-todo i")

        startedProgress == false ? progressBar.style.display = "flex" : startedProgress = true;

        if(changeIcon) {
            changeIcon.className = inProgress ? "fa-solid fa-pause" : "fa-solid fa-play"
            inProgress = !inProgress;
        }
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editInputValue = await titleValidation(editInput.value);
    const editStartValue = editStart.value;
    const editEndValue = editEnd.value;
    const editDescValue = editDesc.value;

    updateTodo(editInputValue, editStartValue, editEndValue, editDescValue);
    toggleForms();
})

const searchElement = document.querySelector('#search input')
searchElement.addEventListener('input', searchTasks)

function searchTasks() {
    const tasks = document.querySelectorAll('div .collapsible')
    if(searchElement.value != '') {
        for(let task of tasks) {
            let title = task.querySelector('h3')
            title = title.textContent.toLowerCase()
            let filterText = searchElement.value.toLowerCase()
            if(!title.includes(filterText)) {
                task.style.display = "none"
            } else {
                task.style.display = "flex"
            }
        }
    } else {
        for(let task of tasks) {
            task.style.display = "flex"
        }
    }
}

const filterElement = document.querySelector('#filter select');
filterElement.addEventListener('change', filterTasks);

function filterTasks() {
    const tasks = document.querySelectorAll('.collapsible');

    for(let task of tasks) {
        let tags = task.querySelectorAll('h6');
        let hasMatchingTag = false;

        for(let tag of tags) {
            let tagValue = tag.getAttribute('data-value');
            if(tagValue && tagValue.split(' ').includes(filterElement.value)) {
                hasMatchingTag = true;
            }
        }

        if(filterElement.value == 'all' || hasMatchingTag) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }
    }
}

function frame() {
    if (width >= 100) {
        clearInterval(progressInterval);
    } else {
        width++;
        document.querySelector(".progress").style.width = width + "%";
    }
}

function progress() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    } else {
        progressInterval = setInterval(frame, 1000);
    }
}
