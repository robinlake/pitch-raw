const volume = document.getElementById('volume')
const visualizer = document.getElementById('visualizer')

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer)
  
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserNode.getByteFrequencyData(dataArray)
    const width = visualizer.width
    const height = visualizer.height
    const barWidth = width / bufferLength
  
    const canvasContext = visualizer.getContext('2d')
    canvasContext.clearRect(0, 0, width, height)
  
    dataArray.forEach((item, index) => {
      const y = item / 255 * height / 2
      const x = barWidth * index
  
      canvasContext.fillStyle = `hsl(${y / height * 400}, 100%, 50%)`
      canvasContext.fillRect(x, height - y, barWidth, y)
    })
  }
  
  function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
  }