## AJM: for Content-Type: application/json

##  See http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
##  This template will pass through all parameters including path, querystring, header, stage variables, and context through to the integration endpoint via the body/payload
#set($allParams = $input.params())
{
    "bodyJson" : $input.json('$'),
    "params" : {
#foreach($type in $allParams.keySet())
#set($params = $allParams.get($type))
	"$type" : {
#foreach($paramName in $params.keySet())
	    "$paramName" : "$util.escapeJavaScript($params.get($paramName))"
#if($foreach.hasNext),#end
#end
	}
#if($foreach.hasNext),#end
#end
    },
    "stageVariables" : {
#foreach($key in $stageVariables.keySet())
	"$key" : "$util.escapeJavaScript($stageVariables.get($key))"
#if($foreach.hasNext),#end
#end
    },
    "context" : {
	"accountId" : "$context.identity.accountId",
	"apiId" : "$context.apiId",
	"apiKey" : "$context.identity.apiKey",
	"authorizerPrincipalId" : "$context.authorizer.principalId",
	"caller" : "$context.identity.caller",
	"cognitoAuthenticationProvider" : "$context.identity.cognitoAuthenticationProvider",
	"cognitoAuthenticationType" : "$context.identity.cognitoAuthenticationType",
	"cognitoIdentityId" : "$context.identity.cognitoIdentityId",
	"cognitoIdentityPoolId" : "$context.identity.cognitoIdentityPoolId",
	"http-method" : "$context.httpMethod",
	"stage" : "$context.stage",
	"sourceIp" : "$context.identity.sourceIp",
	"user" : "$context.identity.user",
	"userAgent" : "$context.identity.userAgent",
	"userArn" : "$context.identity.userArn",
	"requestId" : "$context.requestId",
	"resourceId" : "$context.resourceId",
	"resourcePath" : "$context.resourcePath"
    }
}
