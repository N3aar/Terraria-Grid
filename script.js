const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const zoom = document.querySelector('#zoom')
const opacity = document.querySelector('#opacity')

const textZoom = document.querySelector('#text-zoom')
const textOpacity = document.querySelector('#text-opacity')

const scale = document.querySelector('#scale')
const upload = document.querySelector('#uploader')
const save = document.querySelector('#download')
const clear = document.querySelector('#clear')

const audio = new Audio('./tick.mp3')
const example = new Image()

const grid = {
  image: example,
  x: 0,
  y: 0,
  zoom: 100,
  opacity: 1,
  sizeSquare: 16
}

const arrows = {
  KeyW: () => grid.y--,
  KeyA: () => grid.x--,
  KeyS: () => grid.y++,
  KeyD: () => grid.x++
}

audio.volume = '0.3'

example.onload = () => update()
example.src = './example.png'

function drawSquares () {
  const widthSquares = Math.round(canvas.width / grid.sizeSquare)
  const heightSquares = Math.round(canvas.height / grid.sizeSquare)

  ctx.strokeStyle = `rgba(90, 148, 255, ${grid.opacity})`

  if (scale.checked) {
    ctx.font = '11px Ariel'
    ctx.fillStyle = `rgba(255, 255, 255, ${grid.opacity})`
    ctx.fillText(0, 2, 10)
  }

  for (let i = 0; i < widthSquares; i++) {
    const x = (grid.sizeSquare * i)

    for (let j = 0; j < heightSquares; j++) {
      const y = (grid.sizeSquare * j)

      if (scale.checked) {
        if (y && !x) {
          ctx.fillText(j, 2, y + 10)
        }

        if (x && !y) {
          ctx.fillText(i, x + 2, 10)
        }
      }

      ctx.strokeRect(x + grid.x, y + grid.y, grid.sizeSquare, grid.sizeSquare)
    }
  }
}

function drawImage () {
  canvas.width = grid.image.width
  canvas.height = grid.image.height
  ctx.drawImage(grid.image, 0, 0, grid.image.width, grid.image.height)
}

function update (before) {
  if (before) {
    before()
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawImage()
  drawSquares()
}

function changeZoom () {
  textZoom.innerHTML = `Zoom ${zoom.value}%`
  grid.zoom = Number(zoom.value)
  grid.sizeSquare = (16 / 100) * grid.zoom
}

function changeOpacity () {
  textOpacity.innerHTML = `Opacity ${opacity.value}%`
  grid.opacity = Number(opacity.value) / 100
}

function uploaded (e) {
  audio.play()
  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    grid.image = img
    img.onload = () => update(drawImage)
    img.src = event.target.result
  }
  reader.readAsDataURL(e.target.files[0])
}

function download () {
  audio.play()
  const dataURL = canvas.toDataURL("image/png")
  save.href = dataURL
  save.download = 'grid'
}

function reset() {
  audio.play()

  grid.image = example
  canvas.width  = 400
  canvas.height = 400
  zoom.value = 100
  opacity.value = 100
  grid.x = 0
  grid.y = 0

  changeZoom()
  changeOpacity()
  update()
}

function moveGrid (event) {
  const evt = event || window.event
  const move = arrows[evt.code]

  if (move) {
    move()
    update()
  }
}

// Utils
const addclass = doc => doc.classList.add('color-white')
const removeclass = doc => doc.classList.remove('color-white')

// Events
zoom.addEventListener('mouseover', () => addclass(textZoom))
zoom.addEventListener('mouseout', () => removeclass(textZoom))
zoom.addEventListener('input', () => update(changeZoom))
zoom.addEventListener('change', () => audio.play())

opacity.addEventListener('mouseover', () => addclass(textOpacity))
opacity.addEventListener('mouseout', () => removeclass(textOpacity))
opacity.addEventListener('input', () => update(changeOpacity))
opacity.addEventListener('change', () => audio.play())

scale.addEventListener('change', () => update())
scale.addEventListener('click', () => audio.play())
upload.addEventListener('change', uploaded, false)
save.addEventListener('click', download)
clear.addEventListener('click', reset)

window.addEventListener('keydown', moveGrid)
