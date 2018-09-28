# Demo App

This project has an express backend that serves a default config.json to kepler-demo
- server runs on port 5000
- client runs on port 8080

![screenshot]('./public/screenshot.png')

### Local dev
```
cd server
npm install
npm start
```
- add mapbox access token to node env
```
export MapboxAccessToken=<your_mapbox_token>
```
```
cd client
yarn --ignore-engines
yarn start
```
