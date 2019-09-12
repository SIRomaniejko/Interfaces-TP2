//variables globales
let context = document.querySelector("#js-canvas").getContext("2d");
let width = document.querySelector("#js-canvas").getAttribute("width").replace(/px/, '');
let height = document.querySelector("#js-canvas").getAttribute("height").replace(/px/, '');



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

//clases

class Punto{
    constructor(x, y, poligono){
        this.y  = y;
        this.x = x;
    }
    move(yMovement, xMovement, recalcular){
        this.y += yMovement;
        this.x += xMovement;
        if(recalcular){
            poligono.calcularCentro();
        }
    }

    getY(){
        return this.y;
    }

    getX(){
        return this.x;
    }
}

class PuntoCentral{
    constructor(x, y, poligono){
        this.poligono = poligono;
        this.y  = y;
        this.x = x;
    }
    
    move(yMovement, xMovement){
        poligono.getAllPuntos().foreach(punto=>{
            punto.move(yMovement, xMovement, false);
        })
        this.y += yMovement;
        this.x += xMovement;
    }

    getY(){
        return this.y;
    }

    getX(){
        return this.x;
    }
}

class Poligono{
    constructor(radioPuntos, radioCentro, colorPunto, colorCentro, colorLinea){
        this.radioPuntos = radioPuntos;
        this.radioCentro = radioCentro;
        this.colorPunto = colorPunto;
        this.colorCentro = colorCentro;
        this.colorLinea = colorLinea;
        this.puntos = new Array();
        this.puntoCentral = null;
    }
    
    addPunto(x, y){
        this.puntos.push(new Punto(x, y, this));
    }

    getPunto(x, y){
        if(this.esDentroPunto(this.puntoCentral, x, y)){
            return this.puntoCentral;
        }
        for(let xi; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(puntos[xi], x, y)){
                return this.puntos[xi];
            }
        }
        return null;
    }

    deletePunto(x, y){
        if(this.esDentroPunto(this.puntoCentral, x, y)){
            return 2;
        }
        for(let xi; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(puntos[xi], x, y)){
                this.puntos.splice(xi,xi);
                this.calcularCentro();
                return 1;
            }
        }
        return 0;
    }

    esDentroPunto(punto, x, y){
        let calculoX = Math.pow((x - punto.getX()), 2);
        let calculoY = Math.pow((y - punto.getY()), 2);
        let distanciaCalculo = Math.cbrt(calculoX + calculoY);
        return distanciaCalculo <= this.radioPuntos;
    }

    calcularCentro(){
        let puntos = 0;
        let x = 0;
        let y = 0;
        this.puntos.forEach(punto=>{
            x += punto.getX;
            y += punto.getY;
            puntos++;
        })
        this.puntoCentral = new PuntoCentral(Math.floor(x/puntos), Math.floor(y/puntos));
    }

    getAllPuntos(){
        return this.puntos;
    }

    getRadioPuntos(){
        return this.radioPuntos;
    }
    getRadioCentro(){
        return this.radioCentro;
    }
    getColorPuntos(){
        return this.colorPunto;
    }
    getColorCentro(){
        return this.colorCentro;
    }
    getColorLinea(){
        return this.colorLinea;
    }
}


//
let radioCirculo = 10;
let radioCentro = 7;
let colorCirculo ={ r: 255,
                    g: 0,
                    b: 0};
let colorCentro ={  r: 0,
                    g: 255,
                    b: 0};
let colorLinea ={   r: 255,
                    g: 255,
                    b: 0};
let poligonos = new Array();
let poligonoSeleccionado = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
poligonos.push({    poligono: poligonoSeleccionado,
                    estaTerminado: false   
});


//eventos

let lastClick = null;
document.querySelector("#js-canvas").addEventListener("click", event=>{
    console.log("Y: " + event.layerY);
    console.log("X: " + event.layerX);
    if(lastClick == null || (event.timeStamp - lastClick.timeStamp) > 200){
        poligonoSeleccionado.addPunto(event.layerX, event.layerY);
        lastClick = event;
        draw(poligonoSeleccionado);
    }
    //accion click
})


function draw(poligono, estaTerminado){
    let colorPunto = poligono.getColorPuntos();
    let colorLinea = poligono.getColorLinea();
    context.lineCap = 'butt';
    context.fillStyle = "rgb(" + colorPunto.r + ", " + colorPunto.g + ", " + colorPunto.b + ")";
    context.strokeStyle = "rgb(" + colorLinea.r + ", " + colorLinea.g + ", " + colorLinea.b + ")";

    let puntoAnterior = null;
    let puntoInicial = null;
    let puntos = poligono.getAllPuntos();
    for(xi = 0; xi < puntos.length; xi++){
        let punto = puntos[xi];
        if(xi == 0){
            puntoInicial = punto;
        }
        context.beginPath();
        console.log(punto);
        context.arc(punto.getX(), punto.getY(), poligono.getRadioPuntos(), 0, Math.PI*2);
        context.fill()
        context.closePath();

        if(puntoAnterior){
            drawLine(puntoAnterior, punto);
        }

        if(xi == puntos.length - 1 && estaTerminado){
            drawLine(punto, puntoInicial);
        }

        puntoAnterior = punto;
    }

    function drawLine(puntoAnterior, punto){
        context.beginPath();
        context.moveTo(puntoAnterior.getX(), puntoAnterior.getY());
        context.lineTo(punto.getX(), punto.getY());
        context.stroke();
        context.closePath();
    }
    /*poligono.getAllPuntos().forEach(punto=>{
        context.beginPath();
        console.log(punto);
        context.arc(punto.getX(), punto.getY(), poligono.getRadioPuntos(), 0, Math.PI*2);
        context.fill()
        context.closePath();

        if(puntoAnterior){
            context.beginPath();
            context.moveTo(puntoAnterior.getX(), puntoAnterior.getY());
            context.lineTo(punto.getX(), punto.getY());
            context.stroke();
            context.closePath();
        }

        puntoAnterior = punto;
    })*/
}

document.querySelector("#js-terminarPoligono").addEventListener("click", ()=>{
    console.log("termina2");
    draw(poligonoSeleccionado, true);
    poligonoSeleccionado = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
    poligonos[poligonos.length-1].estaTerminado = true;
    poligonos.push({    poligono: poligonoSeleccionado,
                        estaTerminado: false   
    });
    console.log(poligonos);
})
/*function draw(poligono){
    arco(poligono.getAllPuntos()[0].getX(), poligono.getAllPuntos()[0].getY(), poligono.getRadioPuntos(), 0, 2, poligono.getColorPuntos());
}

function arco(x, y, radio, inicio, fin, colorCirculo){
    context.beginPath();
    console.log("dibujo circulo");
    console.log(x);
    console.log(y);
    console.log(colorCirculo);
    console.log(radio);
    context.arc(x, y, radio, Math.PI*inicio, Math.PI*fin);
    context.lineCap = 'butt';
    context.fillStyle = "rgb(" + colorCirculo.r + ", " + colorCirculo.g + ", " + colorCirculo.b + ")";
    context.fill();
    context.closePath();
}*/