# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2022-02-17
- Many additions/changes, but they are from over 2 years ago, so I don't remember them
- Dependency upgrades to remove vulnerabilities

## [0.3.0] - 2019-11-08
### Source
#### Added
- Implemented `mostCommonDenominator` in `decode_util.js`
  - Added tests
- Added `randomString` to `util.js`
- Encoding
  - Added function `encode` to new file `encode.js`
  - Added tests

#### Changed
- Moved all custom types to `types.js`
- Moved `randomUniqueString` from `decode_util.js` to `util.js`

## [0.2.0] - 2019-11-06
### General
#### Added
- npm package: `package.json` and `package-lock.json`
- ESLint: `.eslintrc.js` and the `eslint` npm package

### Source
#### Changed
- Moved many functions in `index.js` to `decode_util.js` for better separation of concerns
- `decode` improvements
  - `getKeyLength` functions started, namely `getDistances`
#### Added
- Jest
  - `jest` and `eslint-plugin-jest` npm packages
  - `decode_util.test.js`, which currently test `getDistances`
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
