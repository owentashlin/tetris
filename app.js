document.addEventListener('DOMContentLoaded', () => {
//Game Board   
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const levelDisplay = document.querySelector('#level')
    const startBtn = document.querySelector('#start_button')
    const resetBtn = document.querySelector('#reset_button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    let level = 1
    const colors = ['red', 'yellow', 'green', 'blue', 'purple']

//Tetriminoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const tetriminoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0
  
  let random = Math.floor(Math.random()*tetriminoes.length)
  let current = tetriminoes[random][currentRotation]

//draw tetrimino
  function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetrimino') 
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

//undraw tetrimino
  function unDraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetrimino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
  }

//move controls
  function control(e) {
    if(e.keyCode === 37){
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
  }
  document.addEventListener('keyup', control)

  function moveDown() {
    unDraw()
    currentPosition += width
    draw()
    freeze()
  }

  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random()*tetriminoes.length)
        current = tetriminoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        addLevel()
        gameOver()
    }
  }

  function moveLeft() {
    unDraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }
    draw()
  }

  function moveRight() {
    unDraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }
    draw()
  }

  function rotate() {
    unDraw()
    currentRotation ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = tetriminoes[random][currentRotation]
    draw()
  }

//next up display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

const upNextTetrimino = [
    [1, displayWidth+1, displayWidth*2+1, 2],
    [0,displayWidth,displayWidth+1,displayWidth*2+1],
    [1,displayWidth,displayWidth+1,displayWidth+2],
    [0,1,displayWidth,displayWidth+1],
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1],
]
 
function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetrimino')
        square.style.backgroundColor = ''
    })
    upNextTetrimino[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetrimino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom] 
    })
}

//game scoring and end of game functions
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
          timerId = setInterval(moveDown, (( 11 - level ) * 100 ))
        nextRandom = Math.floor(Math.random()*tetriminoes.length)
        displayShape()
    }
})

function addScore() {
    for (let i=0; i<199; i+=width) {
     const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
     if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetrimino')
            squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
     }
    }
}

function addLevel() {
    if (score < 99){
      level = 1 
    } else if (score >= 100 && score <= 199) {
      level = 2
    } else if (score >= 200 && score <= 299) {
      level = 3
    } else if (score >= 300 && score <= 399) {
      level = 4
    } else if (score >= 400 && score <= 499) {
      level = 5
    } else if (score >= 500 && score <= 599) {
      level = 6
    } else if (score >= 600 && score <= 699) {
      level = 7
    } else if (score >= 700 && score <= 799) {
      level = 8
    } else if (score >= 800 && score <= 899) {
      level = 9
    }
  levelDisplay.innerHTML = level
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over'
        clearInterval(timerId)
    }
}

resetBtn.addEventListener('click', () => {
        window.location.reload()
  })

})