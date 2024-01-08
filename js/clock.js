const timer = document.querySelector("#clockDisplay")
var format = 0;

document.getElementById('format').addEventListener('change', function () {
    format = this.checked ? 1 : 0;
});

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session;

    if(format == 0) {
        if(h == 0){
            h = 12;
            session = "AM";
        }

        if(h > 12){
            h = h - 12;
            session = "PM";
        }
    } else {
        session = "";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("clockDisplay").innerText = time;
    document.getElementById("clockDisplay").textContent = time;

    setTimeout(showTime, 1000);

}

showTime();

const showClock = () => {
    clockBtn.classList.toggle("button-actived");
    clockBtn.classList.toggle("iconbutton-actived");

    if(clockBtn.classList.contains("button-actived")) {
        timer.classList.add("pulse");
        timer.classList.remove("out");
        timer.classList.remove("out2")
    } else {
        timer.classList.add("out");
        setTimeout(function(){
            timer.classList.add("out2")
            timer.classList.remove("pulse")
        },1900);
    }
};
