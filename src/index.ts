import { pdfManager } from './pdf-manager'
import { createWorker } from 'tesseract.js'

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://pbs.twimg.com/media/FgFiIk5X0AAh7yf?format=jpg&name=small');
  console.log(text);
  await worker.terminate();
})();

console.log('wee')

const getPdfText = pdfManager.getPdfText

export { getPdfText }
