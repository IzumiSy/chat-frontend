# Chat App Frontend
This repository is the frontend side of chat application.  

Backend server is here: https://github.com/IzumiSy/chat-api-server

<img src="https://d2v9k5u4v94ulw.cloudfront.net/assets/images/279641/original/bc837774-7907-4ec3-88a9-510769fc4e4d.png?1454004103" width="450">

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
