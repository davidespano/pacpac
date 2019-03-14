FROM node:latest
WORKDIR /app
# ------ production ----------
COPY package.json /app
RUN npm install
COPY . /app
#RUN npm install -g serve
#CMD npm run-script build
#CMD serve -s build

#------- debug ----------
CMD cd src && npm start
EXPOSE 3006