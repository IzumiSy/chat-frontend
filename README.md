# Chat App Frontend
This repository is the frontend side of chat application.  

Backend server is here: https://github.com/IzumiSy/chat-api-server

<img src="https://dl.dropboxusercontent.com/u/50923926/chat-frontend-screen-shot.png" width="450">

## Setup
Install dependencies
```Bash
$ npm install
```

Edit API server url
```Bash
$ cp .env.sample .env
$ vi .env
```

## Run
```Bash
$ npm start
```
## Build
```Bash
$ npm run build
```
## (WIP) Deploy to S3
Need to edit secret keys in .env
```Bash
$ npm run deploy
```
## Cleanup
```Bash
$ npm run clean
```
