#!/bin/bash
git checkout dev
cp ./client/.env-sample ./client/.env
cp ./server/config-sample.js ./server/config.js
cp ./server/test/config/config-sample.js ./server/test/config/config.js
cp ./server/azure/config-sample.js ./server/azure/config.js
cp ./server/public/mobility/country_centroids/2019-04-30-sample.csv ./server/public/mobility/2019-04-30.csv
cp ./server/public/users/default/config-sample.json ./server/public/users/default/config.json
cp ./client/config-sample.js ./client/config.js
