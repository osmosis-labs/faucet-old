FROM node:16

WORKDIR /app
COPY package*.json /app/
RUN npm install

# Bundle app source
COPY . .

ENV FAUCET_MNEMONIC ""
ENV PORT 8080
ENV REST_ENDPOINT "https://lcd-test.osmosis.zone"
ENV RPC_ENDPOINT "https://rpc-test.osmosis.zone"
ENV REDIS_PORT 6379
ENV REDIS_HOST 'localhost'

CMD [ "node", "server.js" ]
