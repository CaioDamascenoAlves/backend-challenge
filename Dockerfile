FROM node:18.15.0-alpine AS base

# Creat app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ["package*.json", "yarn.lock*", "./"]

FROM base AS dev
ENV NODE_ENV=development
RUN yarn install --fronzen-lockfile
COPY . .
CMD ["yarn", "start:dev"]

FROM dev AS test
ENV NODE_ENV=test
CMD ["yarn", "test"]

FROM test AS test-cov
CMD ["yarn", "test:cov"]

FROM dev AS test-watch
ENV GIT_WORK_TREE=/usr/src/app GIT_DIR=/usr/src/app/.git
RUN apk add git
CMD ["yarn", "test:watch"]

FROM base AS prod
ENV NODE_ENV=production
RUN yarn install --fronzen-lockfile --production
COPY . .
RUN yarn add -g @nestjs/cli
RUN yarn build
CMD ["yarn", "start:prod"]