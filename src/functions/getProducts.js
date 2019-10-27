const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    var tableName = process.env.tableName;

    const req = {
        TableName: tableName
    };

    const resp = await dynamodb.scan(req).promise();

    const res = {
        statusCode: 200,
        body: JSON.stringify(resp.Items)
    };

    return res;
}
