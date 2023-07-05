const volume = document.getElementById('volume')

  function resize() {
    visualizer.width = visualizer.clientWidth * window.devicePixelRatio
    visualizer.height = visualizer.clientHeight * window.devicePixelRatio
  }

  export {volume,  resize}