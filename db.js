const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient;
const ObjectId=mongodb.ObjectId;
const dotenv=require('dotenv').config();


let database;
async function getdatabase(){
    const client= await MongoClient.connect(process.env.MONGOHOST)
    database=client.db('library');

    if (!database) {
        console.log('data Base Not Connected ....!!');
    }
return database;

}

module.exports={getdatabase,ObjectId}