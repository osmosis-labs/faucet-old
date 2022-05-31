# Build
FROM node:16 AS builder

WORKDIR /app
COPY package*.json /app/
RUN npm install

COPY . /app/
RUN npm run build

# Serve build folder via NGINX
FROM nginx:1.21.6-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .


ENV PORT 3000
# You can overwrite the default FAUCET_SERVER set in the .env file dinamically
ENV FAUCET_SERVER "" 

COPY docker/nginx-default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/docker-entrypoint.sh /bin/

RUN chmod +x /bin/docker-entrypoint.sh
ENTRYPOINT ["/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
