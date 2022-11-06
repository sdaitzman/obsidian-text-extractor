import pLimit, { LimitFunction } from 'p-limit'
import { Platform } from 'obsidian'

const cpuCount = Platform.isMobileApp ? 1 : require('os').cpus().length
let backgroundProcesses = Math.max(1, Math.floor(cpuCount * 0.7))
if (backgroundProcesses == cpuCount) {
  backgroundProcesses = 1
}

const sym = Symbol.for('be.scambier.obsidian-text-extract')
// @ts-ignore
if (!globalThis[sym]) {
  console.info(
    'Text Extract - Number of available workers: ' + backgroundProcesses
  )
  // @ts-ignore
  globalThis[sym] = pLimit(backgroundProcesses)
}

// @ts-ignore
export const processQueue: LimitFunction = globalThis[sym]
