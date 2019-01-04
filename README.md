# MagicBox Kepler Demo

[![Chat on Gitter](https://badges.gitter.im/unicef-innovation-dev/Lobby.png)](https://gitter.im/unicef-innovation-dev/Lobby)
[![Maintainability](https://api.codeclimate.com/v1/badges/0ebed2a0a46f9976eaff/maintainability)](https://codeclimate.com/github/unicef/magicbox-kepler-demo/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/0ebed2a0a46f9976eaff/test_coverage)](https://codeclimate.com/github/unicef/magicbox-kepler-demo/test_coverage)

### To see new features, checkout dev branch
[live demo](http://magicbox-kepler-app.eastus.cloudapp.azure.com/)
##### This project has:
- an express backend that serves a default config.json to kepler-demo.
- a "Save Config" button that replaces old default map with current map.

###### Below are two sample schools from Kyrgyzstan, colored according to their level of connectivity to the internet.

![screenshot](screenshot.png)

### Run

```
export MapboxAccessToken=<your_mapbox_token>
bash setup.sh
````
### Docker

````
bash setup.sh
export MapboxAccessToken=<your_mapbox_token>
docker-compose up
````


### Developer Background

This demo is built on [Kepler.gl](http://kepler.gl/). Here are a couple sources for learning how to work with Kepler:

* [Kepler.gl Github](https://github.com/uber/kepler.gl)
* The [Kepler.gl Readme](https://github.com/uber/kepler.gl/blob/master/README.md) has some of the best documentation of how to integrate custom behavior with Kepler
* [Vis Academy Tutorials](http://vis.academy/#/kepler.gl/setup)

Kepler itself is built on [Redux](https://redux.js.org/). An understanding of Redux is helpful for any changes to the UI. Redux has a [basic tutorial](https://redux.js.org/basics) that covers key concepts.
