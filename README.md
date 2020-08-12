# GraphQL Basics

This is a simple project for learning the basics of GraphQL.

### To run in local

We simply need to do `npm install` and then `npm start`

```shell
$ npm install
$ npm start
```

### Babel and Nodemon Setup

First we need to install `@babel/cli`, `@babel/core`, `@babel/node`, `@babel/preset-env` and `nodemon` as dev-dependencies.

```shell
$ npm install @babel/cli @babel/core @babel/node @babel/preset-env nodemon --save-dev
```

Then we need to create a `.babelrc` file for configuring babel.

```shell
$ touch .babelrc
```

This will host any options we might want to configure `babel` with.

```json
{
    "presets": ["@babel/present-env"]
}
```

Then create a simple `index.js` file in `src` folder.

```shell
$ touch src/index.js
```
```js
console.log("Hello Babel");
```

Then we will add our `start` script in `package.json`

```json
"scripts": {
    "start": "nodemon --exec babel-node src/index.js"
  }
```

Now lets run our `index.js`

```shell
$ npm run start 
```
