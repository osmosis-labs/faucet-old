# Faucet
This is a modified backend based on  which did not include a frontend.

# Requirements
- a server like a DO droplet
- Redis
- NodeJs 14+

### Use node 14+. In DigitalOcean update it by
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 14
```

# Install dependencies
```
npm install
```

# Run
```
npm start
```

# Production in DigitalOceam
```
npm install pm2@latest -g
pm2 start
```
To restart use after downloading latest changes from repo `pm2 restart server`

Use the following command to faucet tokens into your wallet address:

# Local Environment
```c
curl -d '{"address":"osmo1...<osmo wallet address>"}' -H 'Content-Type: application/json' http://localhost:8080/request
```

# Testnet
```c
curl -d '{"address":"osmo1a5h27j38jqe9ehqa95cjcm7vg05n56um0lufmj"}' -H 'Content-Type: application/json' https://testnet-faucet.dev-osmosis.zone/request
```
