npm run build
aws --profile ${profile} s3 sync --delete build s3://${bucket}/
