import Tesseract, { createWorker } from 'tesseract.js'

const workerTimeout = 120_000

class OCRWorker {
  private static pool: OCRWorker[] = []

  static getWorker(): OCRWorker {
    const free = OCRWorker.pool.find(w => !w.running)
    if (free) {
      return free
    }
    const worker = new OCRWorker(createWorker())
    OCRWorker.pool.push(worker)
    return worker
  }

  private running = false
  private ready = false

  private constructor(private worker: Tesseract.Worker) {
    worker
      .load()
      .then(() => worker.loadLanguage('eng'))
      .then(() => worker.initialize('eng'))
      .then(() => this.ready = true)
  }

  public async run(msg: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.running = true

      const timeout = setTimeout(() => {
        this.worker.terminate()
        console.warn('Omnisearch - Worker timeout')
        reject('timeout')
        this.running = false
      }, workerTimeout)

      this.worker.postMessage(msg)
      this.worker.onmessage = evt => {
        clearTimeout(timeout)
        resolve(evt)
        this.running = false
      }
    })
  }
}
