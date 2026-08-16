#!/bin/sh
set -e


envsubst '${INTERNAL_WEBHOOK_SECRET}' \
    < /usr/local/nginx/conf/nginx.conf.template \
    > /usr/local/nginx/conf/nginx.conf

attempt=0
until curl -sf -X POST "http://api:3000/api/stream/reset-all?secret=${INTERNAL_WEBHOOK_SECRET}" > /dev/null; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 10 ]; then
        echo "Warning: could not reach API to reset stale is_live state after 10 attempts, starting nginx anyway"
        break
    fi
    sleep 1
done

exec /usr/local/nginx/sbin/nginx -g 'daemon off;'