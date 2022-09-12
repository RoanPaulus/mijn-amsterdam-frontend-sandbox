########################################################################################################################
########################################################################################################################
# Start with a node image for build dependencies
########################################################################################################################
########################################################################################################################
FROM node:16.15.0 as build-deps

# Indicating we are on a CI environment
ENV CI=true

WORKDIR /app

COPY tsconfig.json /app/
COPY tsconfig.bff.json /app/
COPY package.json /app/
COPY package-lock.json /app/
COPY .env.production /app/
COPY .prettierrc.json /app/

RUN npm ci

COPY public /app/public
COPY src /app/src


########################################################################################################################
########################################################################################################################
# Actually building the application
########################################################################################################################
########################################################################################################################
FROM build-deps as build-app

ENV BROWSER=none
ENV CI=true

ARG REACT_APP_ENV=production
ENV REACT_APP_ENV=$REACT_APP_ENV

ENV INLINE_RUNTIME_CHUNK=false
ENV TZ=Europe/Amsterdam


FROM build-app as build-fe
# Build client
RUN npm run build

FROM build-app as build-bff
# Build bff
RUN npm run bff-api:build


########################################################################################################################
########################################################################################################################
# Front-end Web server image (Acceptance, Production)
########################################################################################################################
########################################################################################################################
FROM nginx:stable-alpine as deploy-ap-frontend

LABEL name="mijnamsterdam FRONTEND"
LABEL repository-url="https://github.com/Amsterdam/mijn-amsterdam-frontend"

ENV TZ=Europe/Amsterdam

COPY conf/nginx-server-default.template.conf /etc/nginx/conf.d/default.conf
COPY conf/nginx.conf /etc/nginx/nginx.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

CMD nginx -g 'daemon off;'

# Copy the built application files to the current image
COPY --from=build-fe /app/build /usr/share/nginx/html


########################################################################################################################
########################################################################################################################
# Front-end Web server image Acceptance
########################################################################################################################
########################################################################################################################
FROM deploy-ap-frontend as deploy-acceptance-frontend
COPY --from=build-deps /app/src/client/public/robots.acceptance.txt /usr/share/nginx/html/robots.txt


########################################################################################################################
########################################################################################################################
# Front-end Web server image Production
########################################################################################################################
########################################################################################################################
FROM deploy-ap-frontend as deploy-production-frontend
COPY --from=build-deps /app/src/client/public/robots.production.txt /usr/share/nginx/html/robots.txt


########################################################################################################################
########################################################################################################################
# Bff Web server image (Acceptance, Production)
########################################################################################################################
########################################################################################################################
FROM node:16.13.0 as deploy-ap-bff

ENV BFF_ENV=production
ENV TZ=Europe/Amsterdam

LABEL name="mijnamsterdam BFF (Back-end for front-end)"
LABEL repository-url="https://github.com/Amsterdam/mijn-amsterdam-frontend"

WORKDIR /app

# Copy the built application files to the current image
COPY --from=build-bff /app/build-bff /app/build-bff

# Copy required node modules
COPY --from=build-bff /app/node_modules /app/node_modules
COPY --from=build-bff /app/package.json /app/package.json

# RUN apt-get update \
#   && apt-get install nano

# Run the app
ENTRYPOINT npm run bff-api:serve-build
