# TCC-2 - Monitoring of regions at risk of flooding

> Notice: Vuejs: 2.x | Node: 12.x

## Intro

It is a system with sensors installed in certain regions, capturing information and communicating with a remote server.
which provides a web portal where information can be followed in real time.

## Server and web portal operation

### Server

Functions can be manipulated in the file: `index.js` in the functions folder.

#### Web Portal

Add firebase credentials

```js
import firebaseApp from 'firebase/app'
import 'firebase/firestore'

const firebase = firebaseApp.initializeApp({
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
})
export { firebase, firebaseApp }
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
