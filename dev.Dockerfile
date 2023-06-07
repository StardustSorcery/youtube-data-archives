FROM node:gallium-alpine
ENV NODE_ENV=development
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
VOLUME /opt/app
WORKDIR /opt/app

RUN apk add --no-cache tini tzdata
ENTRYPOINT [ "/sbin/tini", "--" ]

USER node

CMD [ "npm", "run", "dev" ]
