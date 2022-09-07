#!/usr/bin/env sh
set -eu

# Replace PORT in nginx configuration
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Set FAUCET_BACKEND variable dinamically if not empty
# if [ ! -z "$FAUCET_BACKEND" ]
# then
#     sed -i -r "s#window.FAUCET_BACKEND = null;#window.FAUCET_BACKEND = \"$FAUCET_BACKEND\";#" /usr/share/nginx/html/config.js
# fi

exec "$@"