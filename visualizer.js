const volume = document.getElementById('volume')
const visualizer = document.getElementById('visualizer')

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer)

  
    const bufferLength = analyserNode.frequencyBinCount

    const maxFrequency = context.sampleRate;
    const frequencyArray = new Array(bufferLength);
    for (let i = 0; i < bufferLength; i++) {
        frequencyArray[i] = ((i+1)/bufferLength) * maxFrequency;
    }

    const dataArray = new Uint8Array(bufferLength)
    analyserNode.getByteFrequencyData(dataArray)

    const frequencyStrengthMap = new Map()
    for (let i = 0; i < bufferLength; i++) {
        frequencyStrengthMap.set(frequencyArray[i], dataArray[i]);
    }

    sortedStrengths = new Map([...frequencyStrengthMap.entries()].sort((a, b) => b[1] - a[1]))

    if (dataArray[0] > 40) {
        console.log("bufferLength: ", bufferLength);
        console.log("frequencyArray: ", frequencyArray);
        console.log("frequencyStrengthMap: ", frequencyStrengthMap);
        console.log("sortedStrengths: ", sortedStrengths);
        console.log(dataArray);
    }


    // const timeDomainArray = new Uint8Array(bufferLength)
    // analyserNode.getByteTimeDomainData(timeDomainArray)
    // console.log(timeDomainArray);
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
      if (item > 10) {
          canvasContext.strokeText(frequencyArray[index], x, height - y)
      }
    })
  }
  
  function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
  }