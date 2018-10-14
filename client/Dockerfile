FROM node:8
COPY . /usr/src/app

# Create app directory
WORKDIR /usr/src/app
RUN yarn install --ignore-engines
RUN npm install
CMD yarn start
EXPOSE 8080
