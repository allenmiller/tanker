#!/usr/bin/env bash

rm -f build/canary.js.zip
mkdir -p build

zip build/get.js.zip get.js

aws --profile ajmiller \
    --region us-east-1 lambda update-function-code \
    --function-name  arn:aws:lambda:us-east-1:235694731559:function:TankerGET \
    --zip-file fileb://build/get.js.zip