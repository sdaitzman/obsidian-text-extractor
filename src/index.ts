// import { pdfManager } from './pdf-manager'
// const { createWorker } = require('tesseract.js');

// const worker = createWorker();

// (async () => {
//   await worker.load();
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   const { data: { text } } = await worker.recognize('https://pbs.twimg.com/media/FgFiIk5X0AAh7yf?format=jpg&name=small');
//   console.log(text);
//   await worker.terminate();
// })();

// console.log('wee')

// const getPdfText = pdfManager.getPdfText

// export { getPdfText }

import { pdfManager } from './pdf-manager'
import { ocrManager } from './ocr-manager'

const getPdfText = pdfManager.getPdfText.bind(pdfManager)
const getImageText = ocrManager.getImageText.bind(ocrManager)

export { getPdfText, getImageText }
