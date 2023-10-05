FROM node:16.17.0

WORKDIR /frontend

COPY ./ .

RUN npm install -g npm@8.15.0

RUN npm install --legacy-peer-deps

CMD [ "npm","start" ]