FROM node:lts-alpine

USER node

WORKDIR /usr/src/app

COPY --chown=node:node ./packages/client/package.json .
COPY --chown=node:node ./packages/client/package-lock.json .
RUN npm install

COPY --chown=node:node ./packages/client .

CMD [ "npm", "start" ]