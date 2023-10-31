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

const modal = document.querySelector("#modal");
const accept = document.querySelector("#confirm");

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

const saveTodo = (validatedTitle) => {

    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoTitle = document.createElement("h3")

    todoTitle.innerHTML = validatedTitle;
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
todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let inputValue = todoInput.value;

    if(inputValue) {
        let validatedInput = await validation(inputValue);
        saveTodo(validatedInput)
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
        modal.style.display = "block";

        accept.addEventListener("click", (e) => {
            parentElement.remove();
            modal.style.display = "none";
        });

    } else {
        modal.style.display = "none";
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

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editInputValue = await validation(editInput.value);

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms();
})


const searchElement = document.querySelector('#toolbar input')
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
