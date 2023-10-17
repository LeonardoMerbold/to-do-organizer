// Seleção de Elementos
const menuBtn = document.querySelector("#fab");
const options = document.querySelector("#options");
const clockBtn = document.querySelector("#clock-button");

const timer = document.querySelector("#clockDisplay")

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

let oldInputValue;
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

const saveTodo = (text) => {

    let regexp = /^\s+$/;

    if(text.match(regexp)){
        text = "Sem Titulo";
    }else{
        text = text.trim();
    }

    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")

    todoTitle.innerHTML = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-todo")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-todo")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-todo")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    todoList.appendChild(todo)

    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
};

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
        }
    })
}

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue) {
        saveTodo(inputValue)
    }
});

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest("div");
    let todoTitle;

    if(parentElement && parentElement.querySelector("h3")) {
        todoTitle = parentElement.querySelector("h3").innerHTML
    }

    if(targetElement.classList.contains("finish-todo")) {
        parentElement.classList.toggle("done");
    }

    if(targetElement.classList.contains("remove-todo")) {
        parentElement.remove();
    }

    if(targetElement.classList.contains("edit-todo")) {
        toggleForms();

        editInput.value = todoTitle;
        oldInputValue = todoTitle;
    }
})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms();
})


const searchElement = document.querySelector('#toolbar input')
const tasks = document.querySelectorAll('div .todo')

searchElement.addEventListener('input', searchTasks)

function searchTasks() {
    if(searchElement.value != '') {
        for(let task of tasks) {
            let title = task.querySelector('h3')
            title = title.textContent.toLowerCase()
            let filterText = searchElement.value.toLowerCase()
            if(!title.includes(filterText)) {
                task.style.display = "none"
            } else {
                task.style.display = "block"
            }
        }
    } else {
        for(let task of tasks) {
            task.style.display = "block"
        }
    }
}
