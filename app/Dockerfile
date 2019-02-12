FROM node:latest
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm install -g serve
CMD npm run-script build
CMD serve -s build
EXPOSE 5000