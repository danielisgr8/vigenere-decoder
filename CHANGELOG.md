# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2019-10-30
### General
#### Added
- npm package: `package.json` and `package-lock.json`
- ESLint: `.eslintrc.js` and the `eslint` npm package

### Source
#### Changes
- Moved many functions in `index.js` to `decode_util.js` for better separation of concerns
- `decode` improvements
  - `getKeyLength` started
#### Added
- Jest
  - `jest` and `eslint-plugin-jest` npm packages
  - `decode_util.test.js`
- `PolynomialHash.js` from the `javascript-algorithms` repository to help with rolling hashing

## [0.1.0] - 2019-10-23
Project set-up
### Source
#### Added
- `src/` directory
- Empty `index.js` file
### Demo
#### Added
- `demo/` directory
- Base `index.html` file referencing `src/index.js`
### Wiki Article
#### Added
- `wiki_article/` directory
- Base LaTeX file
