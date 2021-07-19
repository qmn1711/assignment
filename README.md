# Assignment

A simple candidate applications management: listing, sorting, filtering.

See the [demo](https://applications-demo.netlify.app).

# Getting Started

You need a nodejs package manager to install all dependencies before starting. Yarn is recommended.

```
yarn install
```

## Running

```
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building

```
yarn build
```

Builds the app for production to the `build` folder.\
Your app is ready to be deployed.

## Testing

```
yarn test
```

Runs Jest to test all files in `src`.


```
yarn test:watch
```
Runs the Jest test watcher in an interactive mode.\
By default, runs tests related to files changed since the last commit.

You can run with Jest CLI options. For example:
```
yarn test --watch
```

```
yarn test:watch --coverage
``` 

## Linting

```
yarn lint
```
Fixes eslint issues for files in `src`.


```
yarn prettier
```
Formats the code in `src`.

# Contributing

If you have ideas or something doesn’t work, please [file an issue](https://github.com/qmn1711/assignment/issues).
