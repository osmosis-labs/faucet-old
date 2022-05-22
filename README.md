# Faucet

# Install dependencies
```
npm install
```

# Run
```
npm start
```

# Production
```
npm install pm2@latest -g
```

Use the following command to faucet tokens into your wallet address:

# Local Environment
```c
curl -d '{"address":"osmo1...<osmo wallet address>"}' -H 'Content-Type: application/json' http://localhost:8080/faucetRequest
```

# Testnet
```c
curl -d '{"address":"osmo16jjqc6jp3kukhv8x84q8hxmn0w37crdw6gpfsm"}' -H 'Content-Type: application/json' https://testnet-faucet.dev-osmosis.zone/faucetRequest
```