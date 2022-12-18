// Obtén una referencia al canvas y al contexto de dibujo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const replayButton = document.getElementById('replayButton');

// Ajustar el tamaño del canvas al % del ancho y al % del alto de la pantalla
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (isMobile) {
    // Ajustar el tamaño del canvas al % del ancho y al % del alto de la pantalla en dispositivos móviles
    canvas.width = window.innerWidth * 0.85;
    canvas.height = window.innerHeight * 0.8;
}else{
    canvas.width = window.innerWidth * 0.25;
    canvas.height = window.innerHeight * 0.75;
}

// Establece el ancho y la altura del área de atrapado
const catchAreaWidth = 100;
const catchAreaHeight = 50;

// Establece la posición inicial del área de atrapado
let catchAreaX = canvas.width / 2 - catchAreaWidth / 2;
let catchAreaY = canvas.height - catchAreaHeight;

// Crea un array para almacenar los elementos que caen
let fallingElements = [];

// Algunos parametros 
let score = 0;
let gameOver = false;
let lastElementTime = 0;
let canvasBackgroundColor = 'lightblue';
let catchAreaColor = 'purple';
let canvasTextColor = 'black';
let canvasTextShadowColor = 'white';


// Función para dibujar el fondo del juego
function drawBackground() {
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Función para dibujar el área de atrapado
function drawCatchArea() {
    ctx.fillStyle = catchAreaColor;
    ctx.fillRect(catchAreaX, catchAreaY, catchAreaWidth, catchAreaHeight);
}

// Función para generar un elemento aleatorio
function generateRandomElement() {

    const currentTime = performance.now();

    if (currentTime - lastElementTime < 500) {
        return;
    }

    // ESTAPARTE ES POR SI SE QUERIA USAR MAS DE UN TIPO DE OBJETOS QUE CAEN
    // Elegir una imagen al azar de una lista
    // const image1 = new Image();
    // image1.src = 'img/Lain_Chikita2.png';

    // const image2 = new Image();
    // image2.src = 'img/Lain_Chikita.png';

    // const images = [image1, image2];
    // const randomIndex = Math.floor(Math.random() * images.length);
    // const image = images[randomIndex];

    const image = new Image();
    image.src = 'img/Lain_Chikita.png';

    // Generar una posición aleatoria en la parte superior del canvas
    const x = Math.random() * (canvas.width - image.width);
    const y = 0;

    // Generar una velocidad aleatoria
    const speed = Math.random() * 5 + 1;

    // Crear un objeto elemento con estos valores
    const element = { image, x, y, speed };

    // Añadir el elemento al array de elementos que caen
    fallingElements.push(element);

    lastElementTime = currentTime;
}

// Función para dibujar y actualizar los elementos que caen
function drawFallingElements() {
    // Recorrer el array de elementos que caen
    for (let i = 0; i < fallingElements.length; i++) {
        const element = fallingElements[i];

        // Dibujar la imagen del elemento
        ctx.drawImage(element.image, element.x, element.y);

        // Actualizar la posición del elemento en función de su velocidad
        element.y += element.speed;

        // Si el elemento ha salido del canvas, se finaliza el juego, ya que perdio
        // El "-5" es para que el jugador pueda ver el elemento causante de la derrota
        if (element.y > canvas.height - 5) {
            gameOver = true;
            replayButton.style.display = 'block';
        }
    }
}

// Función para comprobar si un elemento ha sido atrapado
function checkCollision(element) {
    // Comprobar si las coordenadas del elemento están dentro del área de atrapado
    if (element.x > catchAreaX && element.x < catchAreaX + catchAreaWidth && element.y > catchAreaY && element.y < catchAreaY + catchAreaHeight) {
        return true;
    }
    return false;
}

// Función para actualizar la puntuación y gestionar el fin del juego
function updateScore() {
    // Recorrer el array de elementos que caen
    for (let i = 0; i < fallingElements.length; i++) {
        const element = fallingElements[i];

        // Si el elemento ha sido atrapado, aumentar la puntuación y eliminar el elemento del array
        if (checkCollision(element)) {
            score++;
            fallingElements.splice(i, 1);
            i--;
        }
    }
}


// Función para actualizar y dibujar el juego en cada frame
function update() {
    // Generar un elemento aleatorio cada cierto tiempo
    if (Math.random() < 0.1) {
        generateRandomElement();
    }

    // Actualizar la puntuación y comprobar si el juego ha terminado
    updateScore();

    // Si el juego ha terminado, mostrar un mensaje y detener el bucle
    if (gameOver) {
        ctx.font = '48px sans-serif';
        ctx.fillText('Game Over!', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }

    // Dibujar el fondo y el área de atrapado
    drawBackground();
    drawCatchArea();

    // Dibujar y actualizar los elementos que caen
    drawFallingElements();
    // Mostrar la puntuación en la parte superior del canvas
    ctx.font = '24px sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Llamar a la función update en el próximo frame
    requestAnimationFrame(update);
}

// Iniciar el bucle de juego
update();


// Escuchar el evento mousemove y actualizar la posición del área de atrapado en función de la posición del cursor
canvas.addEventListener('mousemove', event => {
    catchAreaX = event.offsetX - catchAreaWidth / 2;

    // Asegurarse de que el área no se salga del canvas
    if (catchAreaX < 0) {
        catchAreaX = 0;
    }
    if (catchAreaX + catchAreaWidth > canvas.width) {
        catchAreaX = canvas.width - catchAreaWidth;
    }
});

// Escuchar el evento touchmove y actualizar la posición del área de atrapado en función de la posición del dedo
canvas.addEventListener('touchmove', event => {
    // Obtener la posición del dedo
    const touch = event.touches[0];

    // Obtener la posición del dedo en el canvas
    const touchX = touch.clientX - canvas.offsetLeft;

    // Actualizar la posición del área de atrapado para que siempre esté centrada en el dedo
    catchAreaX = touchX - catchAreaWidth / 2;

    // Asegurarse de que el área no se salga del canvas
    if (catchAreaX < 0) {
        catchAreaX = 0;
    }
    if (catchAreaX + catchAreaWidth > canvas.width) {
        catchAreaX = canvas.width - catchAreaWidth;
    }
});

replayButton.addEventListener('click', function() {
    // Reiniciar el juego
    score = 0;
    gameOver = false;
    fallingElements = [];
    replayButton.style.display = 'none';
    update();
});
  


