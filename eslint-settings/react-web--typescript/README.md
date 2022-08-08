# Installation
- Install dependencies
```bash
npm i -D eslint-config-airbnb eslint-plugin-no-inline-styles eslint-plugin-react-hooks eslint-plugin-styled-components-config
```
- Copy [.eslintrc.js](./.eslintrc.js) file to the your project's root dir.
- Copy [.eslintignore](./.eslintignore) file to the your project's root dir.

# Usage
Add next scripts to the your root package.json file:
```json
  "lint": "./node_modules/.bin/eslint . -c .eslintrc.js --quiet --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "./node_modules/.bin/eslint . -c .eslintrc.js --quiet --fix --ext .js,.jsx,.ts,.tsx"
```
