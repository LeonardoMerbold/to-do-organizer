const configBtn = document.querySelector("#config-button");
const todoContainer = document.querySelector("#todo-container");
const configContainer = document.querySelector("#config-container");

const showConfigs = () => {
    configBtn.classList.toggle("button-actived");
    configBtn.classList.toggle("iconbutton-actived");

    if(configBtn.classList.contains("button-actived")){
        todoContainer.style.display = "none";
        configContainer.style.display = "block";
    } else {
        todoContainer.style.display = "block";
        configContainer.style.display = "none";
    }
};
