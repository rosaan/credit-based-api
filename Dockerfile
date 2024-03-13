FROM node:20.10-bullseye as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.10-alpine

WORKDIR /app

COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist
COPY migrations ./migrations
COPY package.json ./package.json
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
