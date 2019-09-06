//variables globales
let context = document.querySelector("#js-canvas").getContext("2d");
let width = document.querySelector("#js-canvas").getAttribute("width").replace(/px/, '');
let height = document.querySelector("#js-canvas").getAttribute("height").replace(/px/, '');
let radio = 10;
let colorCirculo ={ r: 255,
                    g: 0,
                    b: 0};

let lastClick = null;
document.querySelector("#js-canvas").addEventListener("click", event=>{
    console.log("Y: " + event.layerY);
    console.log("X: " + event.layerX);
    if(lastClick == null || (event.timeStamp - lastClick.timeStamp) > 200){
        arco(event.layerX, event.layerY, radio, 0, 2, colorCirculo);
        lastClick = event;
    }
    //accion click
})

let isCPressed = false;
document.addEventListener("keydown", event=>{
    isCPressed = event.code == "KeyC";
})

document.addEventListener("keyup", event=>{
    if(event.code == "KeyC"){
        isCPressed = false;
    }
})

document.addEventListener("wheel", event=>{
    if(isCPressed){
        //accion C + WHEEL
        console.log(event.deltaY);
    }
})

document.addEventListener("dblclick", event=>{
    event.preventDefault();
    //accion doble click
    console.log(event);
})


let isMouseClicked = false;
document.querySelector("#js-canvas").addEventListener("mousedown", event=>{
    isMouseClicked = event.button == 0;
    console.log(isMouseClicked);
})

document.querySelector("#js-canvas").addEventListener("mouseup", event=>{
    if(event.button == 0){
        isMouseClicked = false;
        console.log(isMouseClicked);
    }
})

//click and drag
document.querySelector("#js-canvas").addEventListener("mousemove", event=>{
    if(isMouseClicked){
        //accion de drageo
        console.log("movX: " + event.movementX +  "; movY: " + event.movementY);
    }
    //console.log(event);
})

//fin eventos
//inicio dibujado
function arco(x, y, radio, inicio, fin, colorCirculo){
    console.log("dibujo circulo");
    console.log(x);
    console.log(y);
    context.arc(x, y, radio, Math.PI*inicio, Math.PI*fin);
    context.lineCap = 'butt';
    context.fillStyle = "rgb(" + colorCirculo.r + ", " + colorCirculo.g + ", " + colorCirculo.b + ")";
    context.fill();
    context.closePath();
}