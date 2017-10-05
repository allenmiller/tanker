#!/usr/bin/env bash

rm -f build/canary.js.zip
mkdir -p build

zip build/post.js.zip post.js

aws --profile ajmiller \
    --region us-east-1 lambda update-function-code \
    --function-name arn:aws:lambda:us-east-1:235694731559:function:TankerPOST \
    --zip-file fileb://build/post.js.zip