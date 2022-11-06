// @ts-nocheck
import pLimit, { LimitFunction } from 'p-limit'

const cpuCount = Platform.isMobileApp ? 1 : require('os').cpus().length
let backgroundProcesses = Math.max(1, Math.floor(cpuCount * 0.7))
if (backgroundProcesses == cpuCount) {
  backgroundProcesses = 1
}

const sym = Symbol.for('be.scambier.obsidian-text-extract')
if (!globalThis[sym]) {
  globalThis[sym] = pLimit(backgroundProcesses)
}

export const processQueue: LimitFunction = globalThis[sym]
