# Demo App

##### Chat with us on our [gitter channel](https://gitter.im/unicef-innovation-dev/Lobby)!


##### This project has:
- an express backend that serves a default config.json to kepler-demo.
- the keplergl client has a "Save Config" button that replaces old default map with current map.

###### Below are two sample schools from Kyrgyzstan, colored according to their level of connectivity to the internet.

![screenshot](screenshot.png)

### Install and run

Go to your terminal / command-line interface and type in the following lines:

- Run the backend
```
cd server
cp config-sample.json config.json
yarn install
yarn start
```
- Go back to the root directory
```
cd ..
```
- Add mapbox access token to node env
```
export MapboxAccessToken=<your_mapbox_token>
```
- Run the kepler.gl client
```
cd client
cp config-sample.js config.js
yarn --ignore-engines
yarn start
```
