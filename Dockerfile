FROM node:16.13.2-alpine3.14 AS build
WORKDIR /usr/src/app
COPY .env ./
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN npm install
RUN npm run build

FROM node:16.13.2-alpine3.14 AS api-prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY .env ./
COPY package.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/dist ./dist
CMD ["node","dist/index.js"]