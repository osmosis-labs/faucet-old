# Faucet
Faucet server will expose two endpoints. One to request tokens and one to see the current queue

# Requirements
- Local environment or a server such a DigitalOcean droplet
- Redis
- NodeJs 14+

## Redis setup
- Redis DigitalOcean, 
    Complete guide [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04). 
    ```sh
    sudo apt install redis-server
    sudo nano /etc/redis/redis.conf
    ```
    Update `supervised` to systemd
    ```sh
    sudo systemctl restart redis.service
    ```
- Redis MacOs [more](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)
```sh
brew install redis
```

### Use node 14+
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install 14
```

### Install dependencies
```
npm install
```

### Run
```
npm start
```

### Production in DigitalOceam
```
npm install pm2@latest -g
pm2 start
```
To restart use after downloading latest changes from repo `pm2 restart server`

Use the following command to faucet tokens into your wallet address:

### Local Environment
```c
curl -d '{"address":"osmo1...<osmo wallet address>"}' -H 'Content-Type: application/json' http://localhost:8080/request
```

### Testnet
```c
curl -d '{"address":"osmo1a5h27j38jqe9ehqa95cjcm7vg05n56um0lufmj"}' -H 'Content-Type: application/json' https://testnet-faucet.dev-osmosis.zone/request
```
