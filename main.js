//variables globales
let context = document.querySelector("#js-canvas").getContext("2d");
let width = document.querySelector("#js-canvas").getAttribute("width").replace(/px/, '');
let height = document.querySelector("#js-canvas").getAttribute("height").replace(/px/, '');






//clases

class Punto{
    constructor(x, y, poligono){
        this.y  = y;
        this.x = x;
        this.poligono = poligono;
        
    }
    move(yMovement, xMovement, recalcular){
        //cuando se mueve si recibe recalcular en los parametros le avisa a el poligono que hay que mover el punto central
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
        //cuando se mueve el punto central mueve el resto de los puntos que pertenescan a el mismo poligono
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
        this.saturacion = 0; //porcentaje de saturacion, 100 es blanco, -100 es negro, 0 es color regular
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
        //pregunta si x;y esta dentro de algun punto, si es asi lo devuelve
        if(this.esDentroPunto(this.puntoCentral, x, y, true)){
            
            return this.puntoCentral;
        }
        for(let xi = 0; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(this.puntos[xi], x, y, false)){
                return this.puntos[xi];
            }
        }
        return null;
    }

    deletePunto(x, y){
        if(this.esDentroPunto(this.puntoCentral, x, y, true)){
            return 2;
        }
        for(let xi = 0; xi < this.puntos.length; xi++){
            if(this.esDentroPunto(this.puntos[xi], x, y, false)){
                if(this.puntos.length == 1){
                    return 2;
                }
                else{
                    this.puntos.splice(xi,1);
                }
                this.calcularCentro();
                return 1;
            }
        }
        
        return 0;
    }

    esDentroPunto(punto, x, y, esCentro = false){
        //funcion para saber si un x;y se encuentra en el area de un punto
        let calculoX = x - punto.getX();
        let calculoY = y - punto.getY();
        calculoX = Math.pow(calculoX, 2);
        calculoY = Math.pow(calculoY, 2);
        let suma = calculoX + calculoY;
        let radio = 0;
        if(esCentro){
            radio = this.radioCentro;
        }
        else{
            radio = this.radioPuntos;
        }
        suma = Math.sqrt(suma) - radio;
        return suma <= 0;
    }

    calcularCentro(){
        //funcion que crea un nuevo punto central
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
        return this.getColorSaturado(this.colorPunto);
    }
    getColorCentro(){
        return this.getColorSaturado(this.colorCentro);
    }
    getColorLinea(){
        return this.getColorSaturado(this.colorLinea);
    }
    //
    setRadioPuntos(param){
        this.radioPuntos = param;
    }
    setRadioCentro(param){
        this.radioCentro = param;
    }
    setColorPuntos(param){
        this.colorPunto = param;
    }
    setColorCentro(param){
        this.colorCentro = param;
    }
    setColorLinea(param){
        this.colorLinea = param;
    }
    getColorSaturado(color){
        //calcula el color dependiendo de la saturacion
        let colorSaturado = {}; 
        if(this.saturacion == 0){
            return color;
        }
        else if(this.saturacion > 0){
            
            colorSaturado.r = ((this.saturacion * (255 - color.r)) / 100) + color.r;
            colorSaturado.g = ((this.saturacion * (255 - color.g)) / 100) + color.g;
            colorSaturado.b = ((this.saturacion * (255 - color.b)) / 100) + color.b;
        }
        else{
            colorSaturado.r = -this.saturacion * (-color.r) / 100 + color.r;
            colorSaturado.g = -this.saturacion * (-color.g) / 100 + color.g;
            colorSaturado.b = -this.saturacion * (-color.b) / 100 + color.b;
        }
        return colorSaturado;
    }

    changeSaturacion(saturar){
        //recibe un parametro y modifica la saturacion de acuerdo a si es positivo o negativo
        if(saturar > 0 && this.saturacion < 100){
            this.saturacion += 10;
        }
        else if(saturar < 0 && this.saturacion > -100){
            this.saturacion -= 10;
        }
    }
    getPuntoCentro(){
        return this.puntoCentral;
    }
}


// parametros de creacion poligonos
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

//inicializacion de lista de poligonos y del poligono inicial
let poligonos = new Array();
let poligonoAbierto = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
let poligonoSeleccionado = poligonoAbierto;
poligonos.push({    poligono: poligonoAbierto,
                    estaTerminado: false   
});


//eventos
//click
let selectedPunto = null;
document.querySelector("#js-canvas").addEventListener("click", event=>{
    console.log("Y: " + event.layerY + "; X: " +  event.layerX);
    if(selectedPunto){//si el click comenzo en un punto de poligono terminado se deselecciona el punto y termina la funcion, sino se crea un nuevo punto para el poligono abierto
        selectedPunto = null;
        return;
    }
    poligonoAbierto.addPunto(event.layerX, event.layerY);
    poligonoAbierto.calcularCentro();
    poligonoSeleccionado = poligonoAbierto;
    draw(poligonoAbierto);
})

//click and drag
let isMouseButtonDown = false;
document.querySelector("#js-canvas").addEventListener("mousedown", event=>{
    for(let xi = 0; xi < poligonos.length; xi++){
        if(poligonos[xi].estaTerminado){
            let punto = poligonos[xi].poligono.getPunto(event.layerX, event.layerY);
            if(punto != null){//si el click izquierdo se hiso sobre el punto de algun poligono terminado
                poligonoSeleccionado = poligonos[xi].poligono;
                selectedPunto = punto;
            }
        }
    }
    isMouseButtonDown = event.button == 0;
})

document.querySelector("#js-canvas").addEventListener("mouseup", event=>{
    if(event.button == 0){
        isMouseButtonDown = false;
    }
})

document.querySelector("#js-canvas").addEventListener("mousemove", event=>{
    if(isMouseButtonDown && selectedPunto != null){
        //accion de drageo
        selectedPunto.move(event.movementY, event.movementX, true);
        limpiar(width, height, colorFondo);
        poligonos.forEach(poligono=>{
            refresh();
        })
    }
})

//doble click
document.addEventListener("dblclick", event=>{
    //si se hace doble click recorre los poligonos terminados y les pregunta si se puede borrar las coordenadas, si el poligono responde que borro algo la funcion refresca el canvas y regresa
    for(let xi = 0; xi < poligonos.length; xi++){
        if(poligonos[xi].estaTerminado){
            let response = poligonos[xi].poligono.deletePunto(event.layerX, event.layerY);
            if(response != 0){
                if(response == 2){
                    poligonos.splice(xi, 1);
                }
                refresh();
                return;
            }
        }
    }
})

//cambio saturacion
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
    if(isCPressed){//cuando gira la rueda en el caso de que la tecla c este siendo apretada le pide al poligono cambiar su saturacion, y refresca el canvas
        event.preventDefault();
        poligonoSeleccionado.changeSaturacion(event.deltaY);
        refresh();
    }
}, {passive: false})

function refresh(){
    //limpia el canvas y redibuja los poligonos
    limpiar(width, height, colorFondo);
    poligonos.forEach(poligono=>{
        draw(poligono.poligono, poligono.estaTerminado);
    })
}

function draw(poligono, estaTerminado){
    //dibuja un poligono recibido
    //le pregunta los colores a el poligono
    let colorPunto = poligono.getColorPuntos();
    let colorLinea = poligono.getColorLinea();
    context.lineCap = 'butt';
    //setea los colores
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

        //si no el el primer punto une este con el anterior con una linea
        if(puntoAnterior){
            drawLine(puntoAnterior, punto);
        }

        if(xi == puntos.length - 1 && estaTerminado){//si es el ultimo punto y el poligono esta completo
            drawLine(punto, puntoInicial);//une el primer punto con el ultimo
            let colorCentro = poligono.getColorCentro();//consigue el color del punto central
            context.fillStyle = "rgb(" + colorCentro.r + ", " + colorCentro.g + ", " + colorCentro.b + ")";
            drawCircle(poligono.getPuntoCentro(), poligono.getRadioCentro());//dibuja el punto del centro
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
//funcion que limpia el canvas con blanco
function limpiar(ancho, alto, colorFondo){
    context.beginPath();
    context.fillStyle = "rgb(" + colorFondo.r + ", " + colorFondo.g + ", " + colorFondo.b + ")";
    context.rect(0, 0, ancho, alto);
    context.fill();
    context.closePath();
}

//terminar un poligono
document.querySelector("#js-terminarPoligono").addEventListener("click", ()=>{
    if(poligonoAbierto.isEmpty()){
        alert("tenes que crear almenos un punto");
        return;
    }
    draw(poligonoAbierto, true);
    poligonoAbierto = new Poligono(radioCirculo, radioCentro, colorCirculo, colorCentro, colorLinea);
    poligonoSeleccionado = poligonoAbierto;
    poligonos[poligonos.length-1].estaTerminado = true;
    poligonos.push({    poligono: poligonoAbierto,
                        estaTerminado: false   
    });
})



//extras
document.querySelector("#js-modificarPoligonos").addEventListener("click", ()=>{
    document.querySelector("#js-selectorAtributos").classList.toggle("hidden");
})

document.querySelectorAll(".js-color").forEach(selectorColores =>{
    let color = selectorColores.querySelectorAll(".slider");
    let mostrador = selectorColores.querySelectorAll(".js-valueBox");
    for(let y = 0; y < color.length; y++){
        color[y].addEventListener("input", ()=>{
            mostrador[y].value = Math.floor(color[y].value);
            replaceValorVariables()
        })
        mostrador[y].addEventListener("change", ()=>{
            color[y].value = mostrador[y].value;
            replaceValorVariables()
        })
    }
})

document.querySelector(".js-coords").querySelectorAll("input").forEach(tamanioSelector=>{
    tamanioSelector.addEventListener("input", replaceValorVariables);
})

function replaceValorVariables(){
    radioCirculo = document.querySelector(".js-radio-punto").value;
    radioCentro = document.querySelector(".js-radio-centro").value;
    document.querySelectorAll(".js-color").forEach(selectorColor=>{
        let colorNuevo = {};
        selectorColor.querySelectorAll(".slider").forEach(slider=>{
            switch(slider.getAttribute("name")){
                case "r":
                    colorNuevo.r =  Math.floor(slider.value);
                    break;
                case "g":
                    colorNuevo.g = Math.floor(slider.value);
                    break;
                case "b":
                    colorNuevo.b = Math.floor(slider.value);
            }
        });
        switch(selectorColor.getAttribute("elementoPerteneciente")){
            case "central":
                colorCentro = colorNuevo;
                break;
            case "vertice":
                colorCirculo = colorNuevo;
                break;
            case "linea":
                colorLinea = colorNuevo;
        }
    })
}

document.querySelector("#js-aplicarSeleccionado").addEventListener("click", ()=>{
    poligonoSeleccionado.setRadioPuntos(radioCirculo);
    poligonoSeleccionado.setRadioCentro(radioCentro);
    poligonoSeleccionado.setColorPuntos(colorCirculo);
    poligonoSeleccionado.setColorCentro(colorCentro);
    poligonoSeleccionado.setColorLinea(colorLinea);
    refresh();
})

let defRadioCirculo = radioCirculo;
let defRadioCentro = radioCentro;
let defColorCirculo = { r: colorCirculo.r,
                        g: colorCirculo.g,
                        b: colorCirculo.b
}
let defColorCentro = {  r: colorCentro.r,
                        g: colorCentro.g,
                        b: colorCentro.b
}
let defColorLinea = {   r: colorLinea.r,
                        g: colorLinea.g,
                        b: colorLinea.b
}
document.querySelector("#js-Auto").addEventListener("click", ()=>{
    document.querySelectorAll(".js-color").forEach(selectorColor=>{
        let colorSeleccionado;
        switch(selectorColor.getAttribute("elementoPerteneciente")){
            case "central":
                colorSeleccionado = defColorCentro;
                break;
            case "vertice":
                colorSeleccionado = defColorCirculo;
                break;
            case "linea":
                colorSeleccionado = defColorLinea;
        }
        selectorColor.querySelectorAll(".slidecontainer").forEach(container=>{
            let tipoSlide = container.querySelector(".slider").getAttribute("name");
            container.querySelectorAll("input").forEach(entrada=>{
                switch(tipoSlide){
                    case "r":
                        entrada.value = colorSeleccionado.r;
                        break;
                    case "g":
                        entrada.value = colorSeleccionado.g;
                        break;
                    case "b":
                        entrada.value = colorSeleccionado.b;
                }
            })
        })
    })
    document.querySelector(".js-radio-punto").value = defRadioCirculo;
    document.querySelector(".js-radio-centro").value = defRadioCentro;
    replaceValorVariables();
})

document.querySelector("#js-help").addEventListener("click", ()=>{
    document.querySelector("#js-ayudador").classList.toggle("hidden");
})

/*selectorColor.querySelectorAll(".slider").forEach(slider=>{
    switch(slider.getAttribute("name")){
        case "r":
            colorNuevo.r =  Math.floor(slider.value);
            break;
        case "g":
            colorNuevo.g = Math.floor(slider.value);
            break;
        case "b":
            colorNuevo.b = Math.floor(slider.value);
    }
});
switch(selectorColor.getAttribute("elementoPerteneciente")){
    case "central":
        colorCentro = colorNuevo;
        break;
    case "vertice":
        colorCirculo = colorNuevo;
        break;
    case "linea":
        colorLinea = colorNuevo;
}*/