import { Platform, TFile } from 'obsidian'
import Tesseract, { createWorker } from 'tesseract.js'
import { database } from './database'
import { libVersion, processQueue } from './globals'
import type { ocrLangs } from './ocr-langs'
import { makeMD5 } from './utils'

type OcrOptions = { langs: Array<typeof ocrLangs[number]> }

const workerTimeout = 120_000

class OCRWorker {
  private static pool: OCRWorker[] = []
  private running = false
  private ready = false

  private constructor(private worker: Tesseract.Worker) {}

  static getWorker(): OCRWorker {
    const free = OCRWorker.pool.find(w => !w.running && w.ready)
    if (free) {
      return free
    }
    const worker = new OCRWorker(
      createWorker({
        cachePath: 'tesseract',
      }),
    )
    OCRWorker.pool.push(worker)
    return worker
  }

  public async run(msg: {
    imageData: Buffer
    name: string
    options: OcrOptions
  }): Promise<{ text: string }> {
    return new Promise(async (resolve, reject) => {
      this.running = true

      if (!this.ready) {
        await this.worker.load()
        await this.worker.loadLanguage(msg.options.langs.join('+'))
        await this.worker.initialize(msg.options.langs[0])
        this.ready = true
      }

      const timeout = setTimeout(() => {
        this.worker.terminate()
        console.warn('Omnisearch - Worker timeout')
        reject('timeout')
        this.running = false
      }, workerTimeout)

      try {
        const { data } = await this.worker.recognize(msg.imageData)
        clearTimeout(timeout)
        return resolve(data)
      } catch (e) {
        console.error('Omnisearch - OCR Worker timeout for ' + name)
        resolve({ text: '' })
      } finally {
        this.running = false
      }
    })
  }
}

class OCRManager {
  /**
   * Extract text from an image file.
   * @param file
   * @param options - An array of languages to try. If not provided, the default is English
   */
  public async getImageText(
    file: TFile,
    options: OcrOptions = { langs: ['eng'] },
  ): Promise<string> {
    if (Platform.isMobile) {
      return ''
    }
    return processQueue(this._getImageText, file, options)
  }

  private async _getImageText(
    file: TFile,
    options: OcrOptions,
  ): Promise<string> {
    // 1) Check if we can find by path & size
    const docByPath = await database.images.get({
      path: file.path,
      size: file.stat.size,
    })

    if (docByPath) {
      return docByPath.text
    }

    // 2) Check by hash
    const data = new Uint8ClampedArray(await app.vault.readBinary(file))
    const hash = makeMD5(data)
    const docByHash = await database.images.get(hash)
    if (docByHash) {
      return docByHash.text
    }

    // 3) The image is not cached, extract it
    const worker = OCRWorker.getWorker()
    return new Promise(async (resolve, reject) => {
      try {
        const res = await worker.run({
          imageData: Buffer.from(data.buffer),
          name: file.basename,
          options,
        })
        const text = (res.text as string)
          // Replace \n with spaces
          .replace(/\n/g, ' ')
          // Trim multiple spaces
          .replace(/ +/g, ' ')
          .trim()

        // Add it to the cache
        database.images
          .add({
            hash,
            text,
            path: file.path,
            size: file.stat.size,
            libVersion,
          })
          .then(() => {
            resolve(text)
          })
      } catch (e) {
        // In case of error (unreadable PDF or timeout) just add
        // an empty string to the cache
        database.images
          .add({
            hash,
            text: '',
            path: file.path,
            size: file.stat.size,
            libVersion,
          })
          .then(() => {
            resolve('')
          })
      }
    })
  }
}

export const ocrManager = new OCRManager()
