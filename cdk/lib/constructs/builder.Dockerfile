FROM public.ecr.aws/docker/library/node:22-alpine
# See https://github.com/nodejs/docker-node/tree/4ad03d42d8201011e5924e1ddb7187440606f9d9?tab=readme-ov-file#nodealpine for why this is here
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy the package.json and package-lock.json files for npm ci, so this step is cached
COPY package.json .
COPY package-lock.json .

RUN npm ci

# Copy the rest of the app
COPY . .

# The command to run to build the app (e.g. npm run build)
ARG BUILD_COMMAND

RUN ${BUILD_COMMAND}
RUN rm -rf node_modules