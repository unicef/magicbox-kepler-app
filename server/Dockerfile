FROM node:8-alpine

COPY . /opt/app

WORKDIR /opt/app
 
RUN npm install --only production

EXPOSE 5000

CMD ["npm", "start"]