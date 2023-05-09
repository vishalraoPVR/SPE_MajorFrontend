# pull base image
FROM node:19.5.0-alpine

# set our node environment, either development or production
# development environment because -> node donot allow us to access environment variable from system in prod environment
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm --allow-root -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /WhatAMess
WORKDIR /WhatAMess
ENV PATH /WhatAMess/.bin:$PATH
COPY ./WhatAMess/package.json ./WhatAMess/package-lock.json ./
RUN npm install

# copy in our source code last, as it changes the most
WORKDIR /WhatAMess/app
# for development, we bind mount volumes; comment out for production
COPY ./WhatAMess .

CMD [ "npx", "expo", "start" ]
EXPOSE 19000