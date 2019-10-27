const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = (event, context) => {
    event.Records.forEach(async (record)=> {
        var skus = await getSkusFrom(record);
        await saveSkus(skus);
    })
}

const getSkusFrom = async (record) => {
    const key = record.s3.object.key;
    const bucket = record.s3.bucket.name;

    var params = {Bucket: bucket, Key: key};
    var s3file = await s3.getObject(params).promise();

    var lines = s3file.Body.toString('ascii').split(';');
    var skus = lines.filter(x => x.length > 0).map(x => {
        console.log(x);
        return JSON.parse(x);
    });

    return skus;
}

const saveSkus = async (skus) => {
    var tableName = process.env.tableName;

    const putReqs = skus.map(x => ({
        PutRequest: {
            Item: x
        }
    }));

    const req = {
        RequestItems: {
            [tableName]: putReqs
        }
    };

    await dynamodb.batchWrite(req).promise();
}