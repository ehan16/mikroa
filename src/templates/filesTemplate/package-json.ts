/* eslint-disable no-useless-escape */
export function packageJsonContent(name: string) {
  return `
  {
    "name": "${name}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
    `;
}
