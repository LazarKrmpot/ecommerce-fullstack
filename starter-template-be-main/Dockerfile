FROM --platform=linux/amd64 node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]