FROM node:16.17.0

WORKDIR /frontend

COPY ./ .

RUN npm install -g npm@8.15.0

RUN npm install --legacy-peer-deps

EXPOSE 3000

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build"]
