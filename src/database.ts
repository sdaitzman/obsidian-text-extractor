import Dexie from 'dexie'

class PDFCache extends Dexie {
  pdf!: Dexie.Table<
    { path: string; hash: string; size: number; text: string },
    string
  >
  images!: Dexie.Table<
    { path: string; hash: string; size: number; text: string },
    string
  >

  constructor() {
    super('obsidian-text-extract/cache/' + app.appId)
    this.version(2).stores({
      pdf: 'path, hash, size',
      images: 'path, hash, size',
    })
  }
}

export const database = new PDFCache()
