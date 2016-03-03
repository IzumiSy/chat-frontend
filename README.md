# Chat App Frontend
This repository is the frontend side of chat application.  

Backend server is here: https://github.com/IzumiSy/chat-api-server

**Entrance**  
<img src="https://dl.dropboxusercontent.com/u/50923926/entrance.png" width="450">

**Chatview**  
<img src="https://dl.dropboxusercontent.com/u/50923926/chat-frontend-screen-shot.png" width="450">

## Setup
```Bash
$ npm install
```
In addition, if you have a production server anywhere like Heroku, you need to edit `configs/config-production.json` in order to specify API server to access. You can just leave `configs/config-development.json` even while you plan to launch your local API server with `localhost:3000`.
## Run
**Production**  
```Bash
$ npm start
```
**Development**  
```Bash
$ npm run dev
```

## Cleanup
```Bash
$ gulp clean
```
