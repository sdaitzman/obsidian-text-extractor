# Obsidian Text Extract Library

> Work In Progress - Please report if something is broken

## What is this?

A library, designed for Obsidian plugins, to extract text from PDFs and images. It works by sharing a common cache and pool of workers between all library users.

It is currently used in [Omnisearch](https://github.com/scambier/obsidian-omnisearch)

## How does it work?

First, install it **with a fixed version**:
```json
"dependencies": {
    "obsidian-text-extract": "1.0.3"
}
```

To use it:
```ts
import { getPdfText, getImageText } from 'obsidian-text-extract'

async function getTextFromFile(
  file: TFile
): Promise<string> {
  let content: string
  if (file.path.endsWith('.pdf')) {
    content = await getPdfText(file)
  } else if (file.path.endsWith('.png')) {
    content = await getImageText(file)
  }
  return content
}
```

## Limitations

Text extraction does not work on mobile; calling the functions will just return an empty string.