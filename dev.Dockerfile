FROM node:gallium-alpine
ENV NODE_ENV=development
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
VOLUME /opt/app/
WORKDIR /opt/app/

RUN apk add --no-cache tini tzdata
ENTRYPOINT [ "/sbin/tini", "--" ]

USER node

CMD [ "npm", "run", "dev" ]

ENV MONGO_URI=mongodb://mongo/youtube-data-archives
ENV MONGO_DATABASE=
ENV MONGO_TARGETS_COLLECTION=targets
ENV MONGO_CHANNELS_COLLECTION=channels
ENV GOOGLE_AUTH_METHOD=API-KEY
ENV GOOGLE_API_KEY=
ENV CRON_RULE="0 0 0 * * *"