FROM node:13

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY src src
COPY test test
COPY jest.config.js .
COPY tsconfig.json .

CMD [ "npm", "test" ]
