npm run build
profile=ajmiller
bucket=tanker.ajmiller.net
aws --profile ${profile} s3 sync --delete build s3://${bucket}/


Create DNS Hosted zone "tanker.ajmiller.net" in Route53,
Create CNAME graph.tanker.ajmiller.net. CNAME tanker-ui.ajmiller.net.s3.amazonaws.com

Delegate NS records for tanker.ajmiller.net in Hostway to point to R53

app client ID: 1mf4bo0rjn1gd6mqojit26kbi9
