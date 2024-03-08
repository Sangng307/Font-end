FROM node:18-alpine

WORKDIR /app

# RUN apk add git openssh-client

ENV NODE_ENV development

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . /app

# RUN npm run bootstrap -- --scope finefoods-client
# RUN npm run build -- --scope finefoods-client

#Example client
WORKDIR /app

# CMD npm run start:prod

CMD npm run dev

