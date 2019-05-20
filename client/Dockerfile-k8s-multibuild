FROM node:8-alpine as builder

COPY src /opt/app/src
COPY config /opt/app/config
COPY token /opt/app/token
COPY .babelrc package.json webpack.config.js /opt/app/

WORKDIR /opt/app

RUN npm install && \
    npm run build

COPY public /opt/app/dist/public
COPY index.html main.css /opt/app/dist/

FROM nginx:alpine

COPY --from=builder /opt/app/dist /usr/share/nginx/html