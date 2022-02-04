import * as iam from 'aws-cdk-lib/aws-iam';
import * as sst from '@serverless-stack/resources';

export default class AuthStack extends sst.Stack {
    auth;
    constructor(scope: sst.App, id: string, props?: sst.StackProps | any) {
        super(scope, id, props);
        const { api, bucket } = props;

        this.auth = new sst.Auth(this, 'Auth', {
            cognito: {
                userPool: {
                    signInAliases: { email: true }
                }
            }
        });

        this.auth.attachPermissionsForAuthUsers([
            api,
            new iam.PolicyStatement({
                actions: ["s3:*"],
                effect: iam.Effect.ALLOW,
                resources: [
                    bucket.bucketArn + "/private/${cognito-identity.awazonaws.com:sub}/*",
                ]
            })
        ]);

        this.addOutputs({
            Region: scope.region,
            UserPoolId: this.auth?.cognitoUserPool?.userPoolId!,
            IdentityPoolId: this.auth?.cognitoCfnIdentityPool?.ref,
            UserPoolClientId: this.auth.cognitoUserPoolClient?.userPoolClientId!
        });

    }
}