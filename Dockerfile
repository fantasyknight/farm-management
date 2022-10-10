FROM node:14.15.1 as build-deps
WORKDIR .
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM node:14.15.1
COPY --from=build-deps build build
RUN yarn global add serve
EXPOSE 5000
CMD ["serve", "-s", "build"]
