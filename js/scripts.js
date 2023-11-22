// Seleção de Elementos
const menuBtn = document.querySelector("#fab");
const options = document.querySelector("#options");
const clockBtn = document.querySelector("#clock-button");

const timer = document.querySelector("#clockDisplay")

const toolbarForm = document.querySelector("#toolbar-form");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const editDesc = document.querySelector("#description");
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
options.classList.toggle("hidden-menu");

// Funções
const toggleMenu = () => {
    options.style.setProperty("transition", "2s");
    options.classList.toggle("hidden-menu");
};

const showClock = () => {
    clockBtn.classList.toggle("button-actived");
    clockBtn.classList.toggle("iconbutton-actived");

    if(clockBtn.classList.contains("iconbutton-actived")) {
        timer.classList.add("pulse");
        timer.classList.remove("out");
        timer.classList.remove("out2")
    }else {
        timer.classList.add("out");
        setTimeout(function(){
            timer.classList.add("out2")
            timer.classList.remove("pulse")
        },1900);
    }
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

    const startTime = document.createElement("p");
    startTime.classList.add("start-time");
    time.appendChild(startTime)

    const timeText = document.createElement("p");
    timeText.classList.add("time-text");
    time.appendChild(timeText)

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

    searchTasks();
};

const validation = (title) => {
    let regexp = /^\s+$/;

    title = title.match(regexp) ? "Sem titulo" : title.trim();

    return title;
};

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
    toolbarForm.classList.toggle("hide")
    todoStates.classList.toggle("hide")
};

const updateTodo = (title, desc) => {
    const todosTitles = document.querySelectorAll(".title")
    const todoDescs = document.querySelectorAll(".desc-todo")

    todosTitles.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = title;
        }
    })

    todoDescs.forEach((todo) => {
        let todoDesc = todo.querySelector("p")

        if(todoDesc.innerText === oldDescValue) {
            todoDesc.innerHTML = desc;
        }
    })
}

// Eventos
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let inputValue = todoInput.value;

    if(inputValue) {
        let validatedInput = await validation(inputValue);
        saveTodo(validatedInput)
    }
});

var finishTodoButtons = document.querySelectorAll('.collapsible .finish-todo');
finishTodoButtons.forEach(function (button) {
    button.addEventListener('click', finishTask);
});

function finishTask(event) {
    const button = event.currentTarget;
    const collapsible = button.closest(".collapsible");
    const isDone = collapsible.classList.toggle("done");
    const changeTag = collapsible.querySelector(".info-todo h6");

    if (changeTag) {
        changeTag.textContent = isDone ? "Concluídos" : "Pendentes";
        changeTag.setAttribute("data-value", isDone ? "done" : "todo");
    }

    collapsible.classList.remove("overdue");

    verifyStateTodo(changeTag.dataset.value, button);
}

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest(".collapsible");
    let todoTitle, timeStart, timeEnd, description;

    if(parentElement && parentElement.querySelector("h3")) {
        todoTitle = parentElement.querySelector("h3").innerHTML
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

    const editInputValue = await validation(editInput.value);
    const editDescValue = editDesc.value;
    const icon = document.querySelector(".title i");

    if(editInputValue || editDescValue) {

        editDescValue != '' ? icon.style.display = "flex" : icon.style.display = "none";
        updateTodo(editInputValue, editDescValue);
    }

    toggleForms();
})


const searchElement = document.querySelector('#search input')
searchElement.addEventListener('input', searchTasks)

function searchTasks() {
    const tasks = document.querySelectorAll('div .todo')

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
    const tasks = document.querySelectorAll('.todo');

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

var collapsibles = document.getElementsByClassName("collapsible");

for (let i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", showAndHideDescription);
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

function verifyStateTodo(state, button) {
    const targetDiv = document.querySelector('.'+state+'-state');
    const collapsibleDiv = button.closest('.collapsible');
    targetDiv.appendChild(collapsibleDiv);
}
