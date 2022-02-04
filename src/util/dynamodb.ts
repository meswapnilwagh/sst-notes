import AWS from "aws-sdk";
import { DeleteItemInput, GetItemInput, PutItemInput, QueryInput, UpdateItemInput } from "aws-sdk/clients/dynamodb";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

export default {
    get: (params: GetItemInput) => dynamoClient.get(params).promise(),
    put: (params: PutItemInput) => dynamoClient.put(params).promise(),
    query: (params: QueryInput) => dynamoClient.query(params).promise(),
    update: (params: UpdateItemInput) => dynamoClient.update(params).promise(),
    delete: (params: DeleteItemInput) => dynamoClient.delete(params).promise(),
}