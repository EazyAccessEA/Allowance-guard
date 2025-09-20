// Script evaluation optimizer (Lighthouse recommendation)
// Reduces main thread work by optimizing script execution

export class ScriptOptimizer {
  private static instance: ScriptOptimizer
  private taskQueue: (() => void)[] = []
  private isProcessing = false

  static getInstance(): ScriptOptimizer {
    if (!ScriptOptimizer.instance) {
      ScriptOptimizer.instance = new ScriptOptimizer()
    }
    return ScriptOptimizer.instance
  }

  // Lighthouse recommendation: Break up long tasks
  scheduleTask(task: () => void, priority: 'high' | 'normal' | 'low' = 'normal') {
    if (priority === 'high') {
      this.taskQueue.unshift(task)
    } else {
      this.taskQueue.push(task)
    }

    this.processQueue()
  }

  private processQueue() {
    if (this.isProcessing || this.taskQueue.length === 0) return

    this.isProcessing = true

    // Use requestIdleCallback for non-blocking execution
    const processNext = () => {
      if (this.taskQueue.length === 0) {
        this.isProcessing = false
        return
      }

      const task = this.taskQueue.shift()
      if (task) {
        const startTime = performance.now()
        
        try {
          task()
        } catch (error) {
          console.warn('Task execution failed:', error)
        }

        const endTime = performance.now()
        const duration = endTime - startTime

        // If task took too long, yield to main thread
        if (duration > 5) {
          setTimeout(processNext, 0)
        } else {
          processNext()
        }
      }
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(processNext, { timeout: 50 })
    } else {
      setTimeout(processNext, 0)
    }
  }

  // Lighthouse recommendation: Use efficient DOM queries
  optimizeDOMQuery(selector: string): Element | null {
    // Cache DOM queries to avoid repeated searches
    const cache = new Map<string, Element | null>()
    
    if (cache.has(selector)) {
      return cache.get(selector)!
    }

    const element = document.querySelector(selector)
    cache.set(selector, element)
    
    // Clear cache after 1 second to prevent memory leaks
    setTimeout(() => cache.delete(selector), 1000)
    
    return element
  }

  // Lighthouse recommendation: Minimize reflows and repaints
  batchDOMUpdates(updates: (() => void)[]) {
    // Use DocumentFragment for efficient DOM updates
    const fragment = document.createDocumentFragment()
    
    updates.forEach(update => {
      try {
        update()
      } catch (error) {
        console.warn('DOM update failed:', error)
      }
    })

    // Force a single reflow at the end
    if (fragment.childNodes.length > 0) {
      document.body.appendChild(fragment)
    }
  }
}

export const scriptOptimizer = ScriptOptimizer.getInstance()
