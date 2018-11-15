# MagicBox Kepler Demo

##### Chat with us on our [gitter channel](https://gitter.im/unicef-innovation-dev/Lobby)!


##### This project has:
- an express backend that serves a default config.json to kepler-demo.
- a "Save Config" button that replaces old default map with current map.

###### Below are two sample schools from Kyrgyzstan, colored according to their level of connectivity to the internet.

![screenshot](screenshot.png)


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
>>>>>>> ede695c192d5a5220712c6e6936fa17e773fbd7d
