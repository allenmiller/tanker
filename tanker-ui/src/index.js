import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import config from './config/config.js';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

Amplify.configure({
        Auth: {
            mandatorySignIn: true,
            region: config.cognito.REGION,
            userPoolId: config.constructor.USER_POOL_ID,
            identityPoolId: config.cognito.IDENTITY_POOL_ID,
            userPoolWebClientId: config.cognito.APP_CLIENT_ID
        },
        API: {
            endpoints: [
                {
                    name: "tankerGet",
                    endpoint: config.apiGateway.GET_URL,
                    region: config.apiGateway.REGION
                }
            ]
        }
    }
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
