FROM node:10

MAINTAINER adeelarifbhatti@gmail.com


WORKDIR /usr/src/app
COPY package.json .
RUN npm install 
RUN npm update
#COPY . .

CMD [ "npm","run", "start" ]

