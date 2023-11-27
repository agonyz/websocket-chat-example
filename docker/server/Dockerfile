FROM node:lts-alpine

USER node

WORKDIR /svr/app

COPY --chown=node:node ./packages/server/package.json .
COPY --chown=node:node ./packages/server/package-lock.json .
RUN npm install

COPY --chown=node:node ./packages/server .

EXPOSE 3001

CMD ["npm", "run", "dev"]
