#!/usr/bin/env sh
set -eu

# Replace PORT in nginx configuration
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Set FAUCET_SERVER variable dinamically if not empty
if [ ! -z "$FAUCET_SERVER" ]
then
    sed -i -r "s#window.FAUCET_SERVER = null;#window.FAUCET_SERVER = \"$FAUCET_SERVER\";#" /usr/share/nginx/html/config.js
fi

exec "$@"