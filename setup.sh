#!/bin/bash
git checkout dev
cp ./client/.env-sample ./client/.env
cp ./server/config-sample.js ./server/config.js
cp ./server/azure/config-sample.js ./server/azure/config.js
cp ./server/public/mobility/2017-12-25-sample.csv ./server/public/mobility/2017-12-25.csv
cp ./server/public/users/default/config-sample.json ./server/public/users/default/config.json
cp ./client/config-sample.js ./client/config.js
