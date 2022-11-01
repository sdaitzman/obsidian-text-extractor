// @ts-nocheck
import pLimit, { LimitFunction } from 'p-limit'

const sym = Symbol.for('be.scambier.obsidian-text-extract')
if (!globalThis[sym]) {
  globalThis[sym] = pLimit(10)
}

export const processQueue: LimitFunction = globalThis[sym]
