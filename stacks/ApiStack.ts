import * as sst from "@serverless-stack/resources"
import { ApiAuthorizationType } from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
    api: sst.Api;

    constructor(scope: sst.App, id: string, props?: sst.StackProps | any) {
        super(scope, id, props);
        const { table } = props;

        //Create API Gateway 
        this.api = new sst.Api(this, "Api", {
            defaultAuthorizationType: ApiAuthorizationType.AWS_IAM,
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
                },
            },
            routes: {
                "POST /notes": "src/notes/notes.add",
                "GET /notes/{id}": "src/notes/notes.get",
                "GET /notes": "src/notes/notes.all",
                "PUT /notes/{id}": "src/notes/notes.update",
                "DELETE /notes/{id}": "src/notes/notes.remove",
                "POST /billing": "src/billing.charge",
            },
        });

        this.api.attachPermissions([table]);
        this.addOutputs({
            ApiEndpoint: this.api.url,
        })
    }
}