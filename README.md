# Contrib

A simple web app for people who really care about their github contributions matrices.

## Usage

1. Open [http://contrib.herokuapp.com/](http://contrib.herokuapp.com/) with Safari on your iPhone.
2. Add to Home Screen.

## Hack

1. Have Node.js installed on your machine.
2. Install `gulp` globally.

  ```
  npm install -g gulp
  ```

3. Fork and check out this repository.
4. Install dependencies. npm's `prepublish` hook runs `gulp` and builds static contents.

  ```
  npm install
  ```

6. Start the server.

  ```
  node index.js
  ```

7. You can also open another terminal and start watching file changes.

  ```
  gulp watch
  ```
