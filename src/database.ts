import Dexie from 'dexie'

class PDFCache extends Dexie {
  pdf!: Dexie.Table<
    { path: string; hash: string; size: number; text: string },
    string
  >

  constructor() {
    super('pdf/cache')
    this.version(1).stores({
      pdf: 'path, hash, size',
    })
  }
}

export const database = new PDFCache()
