Set up GCP environment

1) Create project

2) Install gcloud console on mac

https://cloud.google.com/deployment-manager/docs/quickstart

https://cloud.google.com/sdk/docs/quickstart-macos

3) Resources needed:

https://cloud.google.com/free/docs/map-aws-google-cloud-platform

AWS                                   GCP equiv
==============================        ===============================================================
CloudFormation                        Deployment Manager        https://cloud.google.com/deployment-manager/
Route 53 hosted zone                  DNS                       https://cloud.google.com/dns/
API Gateway                           Endpoints                 https://cloud.google.com/endpoints/
POST/GET lambdas                      Functions                 https://cloud.google.com/functions/
POST alarm                            Stackdriver Monitoring    https://cloud.google.com/monitoring/
DynamoDB table                        Datastore                 https://cloud.google.com/datastore/
                                      Firestore                 
SNS topic                             Pub/Sub                   https://cloud.google.com/pubsub/
S3 static storage for web app         Storage                   https://cloud.google.com/storage/



Get started with Deployment Manager https://cloud.google.com/deployment-manager/docs/quickstart

Create managed zone:

 gcloud deployment-manager deployments create tanker-managed-zone --config examples/dns_managed_zone.yaml

Register NS records with hostway:

GET https://www.googleapis.com/dns/v1beta2/projects/tanker-222120/managedZones/tank
{
  "kind": "dns#managedZone",
  "name": "tank",
  "dnsName": "tank.ajmiller.net.",
  "description": "Managed Zone for tank monitor.",
  "id": "1417023797069722928",
  "nameServers": [
    "ns-cloud-e1.googledomains.com.",
    "ns-cloud-e2.googledomains.com.",
    "ns-cloud-e3.googledomains.com.",
    "ns-cloud-e4.googledomains.com."
  ],
  "creationTime": "2018-11-11T20:10:46.681Z"
}

