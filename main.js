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
        this.poligono = poligono;
    }
    move(yMovement, xMovement, recalcular){
        this.y += yMovement;
        this.x += xMovement;
        if(recalcular){
            this.poligono.calcularCentro();
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
        this.poligono.getAllPuntos().forEach(punto=>{
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
    
    isEmpty(){
        return this.puntos.length == 0;
    }
    addPunto(x, y){
        this.puntos.push(new Punto(x, y, this));
    }

    getPunto(x, y){
        if(this.esDentroPunto(this.puntoCentral, x, y)){
            return this.puntoCentral;
        }
        for(let xi = 0; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(this.puntos[xi], x, y)){
                return this.puntos[xi];
            }
        }
        return null;
    }

    deletePunto(x, y){
        console.log(this.puntos);
        if(this.esDentroPunto(this.puntoCentral, x, y)){
            return 2;
        }
        for(let xi = 0; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(this.puntos[xi], x, y)){
                if(xi != 0){
                    this.puntos.splice(xi,1);
                }
                else{
                    this.puntos.shift();
                }
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
        return distanciaCalculo <= (this.radioPuntos/2);
    }

    calcularCentro(){
        let puntos = 0;
        let x = 0;
        let y = 0;
        this.puntos.forEach(punto=>{
            x += punto.getX();
            y += punto.getY();
            puntos++;
        })
        this.puntoCentral = new PuntoCentral(Math.floor(x/puntos), Math.floor(y/puntos), this);
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
    getPuntoCentro(){
        return this.puntoCentral;
    }
}


// parametros de poligonos
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
let colorFondo ={   r:255,
                    g:255,
                    b:255};
let poligonos = new Array();
let poligonoSeleccionado = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
poligonos.push({    poligono: poligonoSeleccionado,
                    estaTerminado: false   
});


//eventos
document.querySelector("#js-canvas").addEventListener("click", event=>{
    console.log("Y: " + event.layerY);
    console.log("X: " + event.layerX);
    if(selectedPunto){
        selectedPunto = null;
        return;
    }
    console.log(selectedPunto);
    poligonoSeleccionado.addPunto(event.layerX, event.layerY);
    poligonoSeleccionado.calcularCentro();
    lastClick = event;
    draw(poligonoSeleccionado);
})
//arrastre
let selectedPunto = null;
let isMouseClicked = false;
document.querySelector("#js-canvas").addEventListener("mousedown", event=>{
    for(let xi = 0; xi < poligonos.length; xi++){
        if(poligonos[xi].estaTerminado){
            let punto = poligonos[xi].poligono.getPunto(event.layerX, event.layerY);
            if(punto != null){
                selectedPunto = punto;
                console.log(selectedPunto);
            }
        }
    }
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
    if(isMouseClicked && selectedPunto != null){
        //accion de drageo
        selectedPunto.move(event.movementY, event.movementX, true);
        limpiar(width, height, colorFondo);
        poligonos.forEach(poligono=>{
            refresh();
        })
    }
    //console.log(event);
})

document.addEventListener("dblclick", event=>{
    for(let xi = 0; xi < poligonos.length; xi++){
        if(poligonos[xi].estaTerminado){
            let response = poligonos[xi].poligono.deletePunto(event.layerX, event.layerY);
            if(response == 2){
                poligonos.splice(xi, 1);
            }
            refresh();
            console.log(response);
        }
    }
    
    console.log("2click");
    console.log(selectedPunto);
    //accion doble click
    console.log(event);
})

function refresh(){
    limpiar(width, height, colorFondo);
    poligonos.forEach(poligono=>{
        draw(poligono.poligono, poligono.estaTerminado);
    })
}

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

        drawCircle(punto, poligono.getRadioPuntos());

        if(puntoAnterior){
            drawLine(puntoAnterior, punto);
        }

        if(xi == puntos.length - 1 && estaTerminado){
            drawLine(punto, puntoInicial);
            colorCentro = poligono.getColorCentro();
            context.fillStyle = "rgb(" + colorCentro.r + ", " + colorCentro.g + ", " + colorCentro.b + ")";
            drawCircle(poligono.getPuntoCentro(), poligono.getRadioCentro());
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

    function drawCircle(punto, radio){
        context.beginPath();
        context.arc(punto.getX(), punto.getY(), radio, 0, Math.PI*2);
        context.fill()
        context.closePath();
    }
}

function limpiar(ancho, alto, colorFondo){
    context.beginPath();
    context.fillStyle = "rgb(" + colorFondo.r + ", " + colorFondo.g + ", " + colorFondo.b + ")";
    context.rect(0, 0, ancho, alto);
    context.fill();
    context.closePath();
}

document.querySelector("#js-terminarPoligono").addEventListener("click", ()=>{
    console.log("termina2");
    if(poligonoSeleccionado.isEmpty()){
        alert("tenes que crear almenos un punto");
        return;
    }
    draw(poligonoSeleccionado, true);
    poligonoSeleccionado = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
    poligonos[poligonos.length-1].estaTerminado = true;
    poligonos.push({    poligono: poligonoSeleccionado,
                        estaTerminado: false   
    });
    console.log(poligonos);
})

document.querySelector("#js-ocultarPoligono").addEventListener("click", ()=>{
    limpiar(width, height, colorFondo);
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