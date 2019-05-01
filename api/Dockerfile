FROM node:latest
WORKDIR /api
COPY package.json /api
RUN npm install
COPY . /api
CMD npm start -- --neo4j remote
EXPOSE 3000