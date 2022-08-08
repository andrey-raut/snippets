# Installation
- Install dependencies
```bash
npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-base
```
- Copy [.eslintrc.js](./.eslintrc.js) file to the your project's root dir.
- Copy [.eslintignore](./.eslintignore) file to the your project's root dir.
- Copy [tsconfig.eslint.json](./tsconfig.eslint.json) file to the your project's root dir.

# Usage
Add next scripts to the your root package.json file:
```json
  "lint": "eslint . -c .eslintrc.js --ext .ts --ignore-path .eslintignore",
  "lint:fix": "eslint . -c .eslintrc.js --ext .ts --ignore-path .eslintignore --fix"
```
