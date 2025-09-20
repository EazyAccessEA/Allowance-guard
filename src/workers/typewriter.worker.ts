// Web Worker for typewriter animation (Lighthouse recommendation)
// This moves heavy computation off the main thread

interface TypewriterMessage {
  type: 'ANIMATE'
  payload: {
    currentMessage: string
    currentLine: number
    isDeleting: boolean
    isPaused: boolean
    typingSpeed: number
    deletingSpeed: number
    pauseTime: number
  }
}

interface TypewriterResponse {
  type: 'UPDATE'
  payload: {
    firstLine: string
    secondLine: string
    isDeleting: boolean
    isPaused: boolean
    currentLine: number
    currentMessageIndex: number
  }
}

self.onmessage = (event: MessageEvent<TypewriterMessage>) => {
  const { type, payload } = event.data

  if (type === 'ANIMATE') {
    const {
      currentMessage,
      currentLine,
      isDeleting,
      isPaused,
      typingSpeed,
      deletingSpeed,
      pauseTime
    } = payload

    const words = currentMessage.split(/\s+/)
    const targetFirstLine = words.slice(0, 2).join(' ')
    const targetSecondLine = words.slice(2).join(' ')

    // Simulate animation logic without blocking main thread
    setTimeout(() => {
      const response: TypewriterResponse = {
        type: 'UPDATE',
        payload: {
          firstLine: targetFirstLine,
          secondLine: targetSecondLine,
          isDeleting: false,
          isPaused: false,
          currentLine: 1,
          currentMessageIndex: 0
        }
      }
      
      self.postMessage(response)
    }, typingSpeed)
  }
}
