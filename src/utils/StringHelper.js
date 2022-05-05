// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-120.php

const toSnakeCaseWithHyphens = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')

// https://www.codegrepper.com/code-examples/javascript/split+array+in+4+parts+using+javascript

const splitArrayIntoChunksOfLen = (arr, len) => {
  const chunks = []; let i = 0; const n = arr.length
  while (i < n) {
    chunks.push(arr.slice(i, i += len))
  }
  return chunks
}

export { toSnakeCaseWithHyphens, splitArrayIntoChunksOfLen }
