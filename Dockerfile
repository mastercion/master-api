FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install mongoose@latest
RUN npm install bson@latest

EXPOSE 3000
EXPOSE 5000