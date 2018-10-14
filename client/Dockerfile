FROM node:latest
COPY . /opt/react
WORKDIR /opt/react
RUN yarn install --ignore-engines
CMD yarn start
EXPOSE 8080
