#!/bin/bash
# npm config set registry https://registry.npm.taobao.org/
# sudo ls -n /usr/local/sbin/node /usr/bin/node
# sudo ls -n /usr/local/sbin/npm /usr/bin/npm
# sudo systemctl status  nginx.service
# des_target="/usr/local/nginx/html/mwc2m-web/scm"

# echo "---------------- npm install begin -------------------"
npm install
# echo "---------------- npm install begin -------------------"

echo "---------------- webpack begin -------------------"
npm run c
npm run b
echo "---------------- webpack end -------------------"

# cp -r ./export/ch  $des_target