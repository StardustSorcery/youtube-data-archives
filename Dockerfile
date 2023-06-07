FROM node:gallium-alpine AS builder
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
WORKDIR /opt/app

RUN chown node:node /opt/app

USER node

COPY --chown=node:node ./package.json ./package-lock.json .
RUN npm install --include=dev

COPY --chown=node:node . .
RUN npm run build

#######################

FROM node:gallium-alpine
ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apk add --no-cache tini tzdata
ENTRYPOINT [ "/sbin/tini", "--" ]

USER node
WORKDIR /opt/app

COPY --chown=node:node package*.json .
RUN npm install

COPY --chown=node:node --from=builder /opt/app/dist ./dist

CMD [ "npm", "start" ]
