# Build
FROM node as build
COPY / /frontend
WORKDIR /frontend
RUN npm i && npm run build
# Production
FROM nginx as production
COPY --from=build /frontend/dist /frontend
COPY ./docker/nginx.conf /etc/nginx
