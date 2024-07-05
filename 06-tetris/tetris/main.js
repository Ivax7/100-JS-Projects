import './style.css'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS }from "./consts";



// 1. CREAMOS CANVAS
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const $score = document.querySelector('span')
const $section = document.querySelector('section')


let score = 0;
canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. Board

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 4. Pieza player
  const piece = {
    position: { x: 5, y: 5 },
    // cueadrado
    shape : [
      [1, 1],
      [1, 1]
    ],
  }

// 9. random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1],
  ],
]

// // 2. GAME LOOP
// 8. auto drop
let dropCounter = 0;
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime
  
  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0

    // checkeamos la colicion cuando baja la pieza por defecto
    if(checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

// Función para dibujar el juego 
function draw() {
  // fondo
  context.fillStyle = '#000'; // color
  context.fillRect(0, 0, canvas.width, canvas.height) // anchura y altura

  // Tablero
  board.forEach((row, y) => { // filas
    row.forEach((value, x) => { // columnas
      if(value === 1){
        context.fillStyle='yellow'; // color
        context.fillRect(x, y, 1, 1) // posicion (x-y)y tamaño (1x1)
      }
    })
  })

  // Piezas
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value) {
        context.fillStyle = 'red' // color
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1) // posición y tamaño
      }
    })
  })

  $score.innerText = score
}

// Evento para mover las piezas
document.addEventListener('keydown', event => {
  if(event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if(checkCollision()) {
      piece.position.x++ // si hay colision la devolvemos a la posicion anterior
    }
  }
  if(event.key ===  EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++ 
    if(checkCollision()) {
      piece.position.x--
    }
  }
  if(event.key ===  EVENT_MOVEMENTS.DOWN){
    piece.position.y++ 
    if(checkCollision()) {
      piece.position.y--
      // al tocar fondo solidificamos la pieza
      solidifyPiece();
      // Checkeamos si se tiene que eliminar la fila al solidificar
      removeRows();
    }
  }

  // rotar las piezas

  if(event.key === 'ArrowUp') {
    // nuevo array para generar nueva pieza y guardarla ahí
    const rotated = []
    
    // iteramos la pieza
    for(let i = 0; i < piece.shape[0].length; i++) { //cuantos elementos tenemos en la fila
      const row=[]

      for(let j = piece.shape.length - 1; j>=0 ; j--) { // cuentas filas tenemos
        row.push(piece.shape[j][i]) // empujamos la posicion actual al revés
      }
      
      rotated.push(row)
    }
    // para evitar errores al intentar rotar la pieza
    const previousShape = piece.shape
    piece.shape = rotated
    if(checkCollision()){
      piece.shape = previousShape // si colisiona cuando la roto que vuelva a su estado anterior (no rotada)
    }
  }
})

// Colisiones

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && // choca cuando hay una pieza o cuando es undefined (margen del juego)
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

// Solidificar las piezas, que las piezas pasen a formar parte del board

function solidifyPiece () {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1) { // solidificamos allí donde la pieza ocupa(un cuadrado ocupa 2x2 por ejemplo pues en esos sitios tiene un valor de 1)
        board[y + piece.position.y][x + piece.position.x] = 1 // la añadimos al board con esas posiciones con el valor 1
      }
    })
  })

  
  // Reseteamos la posicion de la pieza cuando se solidifica 1
  piece.position.x = Math.floor(Math.random() * BOARD_WIDTH/ 2 + 4);
  piece.position.y = 0;

  // get randomShape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]

  // GAMEOVER si antes de mover la piza se choca
  if(checkCollision()) {
    window.alert('Game Over!! Sorry!')
    board.forEach((row) => row.fill(0))
  }

}

// Eliminar las lineas
function removeRows () {
  const rowsToRemove = []
  
  board.forEach((row, y) => {
    // en las líneas donde todos los valores son 1 nos la cargamos pues ya está completada
    if(row.every(value => value === 1)){
      rowsToRemove.push(y);
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1);
    // al eliminar una fila del board empujamos una fila de ceros al principio
    const newRow = Array(BOARD_WIDTH).fill(0); // la nueva fila es de 0 (vacía)
    board.unshift(newRow); // añadimos al principio

    // Por cada línea aumentamos el score
    score += 10;
  });
}

$section.addEventListener('click', () => {
  update()

  $section.remove()
  const audio = new window.Audio('./tetris.mp3');
  audio.volume = 0.5;
  audio.play();

  // Repetir la canción cuando termine
  audio.addEventListener('ended', () => {
    audio.currentTime = 0; // Reiniciar el tiempo de reproducción
    audio.play(); // Volver a reproducir la canción
  });
})

