import { APIGatewayProxyEvent } from "aws-lambda";

const handler = (lambda: any) => {
    return async (event: APIGatewayProxyEvent, context: any) => {
        let body, statusCode;
        try {
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error: any) {
            console.error(error);
            body = { error: error.message };
            statusCode = 500;
        }

        return {
            statusCode,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            }
        };
    }
}

export default handler