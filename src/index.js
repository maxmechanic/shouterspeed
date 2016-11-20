const gumPromise = navigator.mediaDevices.getUserMedia({audio: true, video: false})

gumPromise.then(stream => {
  let vids = Array.from(document.querySelectorAll('video'))
  const observer = new MutationObserver(
    () => vids = Array.from(document.querySelectorAll('video'))
  )
  const config = { childList: true, subtree: true }
  observer.observe(document.body, config)

  const context = new AudioContext()
  const input = context.createMediaStreamSource(stream)
  const analyser = context.createAnalyser()
  input.connect(analyser)

  const bufferLength = analyser.frequencyBinCount
  let dataArray = new Uint8Array(bufferLength)
  analyser.getByteTimeDomainData(dataArray)

  function update() {
    analyser.getByteFrequencyData(dataArray)

    const peakFreq = Math.max(...dataArray)
    const rate = peakFreq / 210

    for (let vid of vids) {
      vid.playbackRate = rate
    }

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
})
