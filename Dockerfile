FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY jest.local.js jest.local.js
COPY babel.config.js babel.config.js
COPY package-lock.json package-lock.json
COPY package.json package.json
COPY framework ./framework
COPY specs ./specs

CMD [ "npm", "test" ]



#FROM node:alpine

#WORKDIR /usr/src/app

#COPY . .

#RUN npm i

#CMD ["npm", "test"]