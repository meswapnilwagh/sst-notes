import * as uuid from "uuid";
import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import handler from "../util/handler";
import dynamodb from "../util/dynamodb";

export const add = handler(async (event: APIGatewayProxyEvent) => {
    const data = JSON.parse(event.body!);
    const params: PutItemInput = {
        TableName: process.env.TABLE_NAME!,
        Item: {
            userId: event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId,
            noteId: uuid.v1(),
            note: data.note,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    }
    console.log('params :', params);
    await dynamodb.put(params);
    return params.Item;
});

export const get = handler(async (event: APIGatewayProxyEvent) => {
    const params: GetItemInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {
            userId: event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId,
            noteId: event?.pathParameters?.id
        }
    };
    const result = await dynamodb.get(params);
    if (!result.Item) {
        throw new Error("Note not found");
    }

    return result.Item;
});

export const all = handler(async (event: APIGatewayProxyEvent) => {
    const params: QueryInput = {
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression: "userId=:userId",
        ExpressionAttributeValues: {
            ":userId": event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId,
        }
    }

    const result = await dynamodb.query(params)
    return result.Items;
});

export const update = handler(async (event: APIGatewayProxyEvent) => {
    const data = JSON.parse(event.body!);
    console.log('data :', data);
    const params: UpdateItemInput = {
        TableName: process.env.TABLE_NAME!,
        Key: {
            userId: event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId,
            noteId: event?.pathParameters?.id
        },
        UpdateExpression: "SET note=:note, attachment=:attachment",
        ExpressionAttributeValues: {
            ":note": data.note || null,
            ":attachment": data.attachment || null
        },
        ReturnValues: "ALL_NEW"
    }
    await dynamodb.update(params);
    return { status: true };
});

export const remove = handler(async (event: APIGatewayProxyEvent) => {
    const params: DeleteItemInput = {
        TableName: process?.env?.TABLE_NAME!,
        Key: {
            userId: event?.requestContext?.authorizer?.iam.cognitoIdentity.identityId,
            noteId: event?.pathParameters?.id
        }
    }

    await dynamodb.delete(params);
    return { status: true };
});