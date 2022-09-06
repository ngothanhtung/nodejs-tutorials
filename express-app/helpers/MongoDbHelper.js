'use strict';
// Khai báo thư viện MongoClient
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

// Chuỗi kết nối đến MongoDB
const DATABASE_NAME = 'api-training';
const CONNECTION_STRING = 'mongodb://127.0.0.1:27017/' + DATABASE_NAME;

// INSERT: Thêm mới (một)
function insertDocument(data, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        collection
          .insertOne(data)
          .then((result) => {
            client.close();
            resolve({ data: data, result: result });
          })
          .catch((err) => {
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// INSERT: Thêm mới (nhiều)
function insertDocuments(list, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        collection
          .insertMany(list)
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// UPDATE: Sửa
function updateDocument(id, data, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        const query = { _id: ObjectID(id) };
        collection
          .findOneAndUpdate(query, { $set: data })
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            console.log(err);
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// UPDATE: Sửa (nhiều)
function updateDocuments(query, data, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        collection
          .updateMany(query, { $set: data })
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// REMOVE: Xoá
function deleteDocument(id, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        const query = { _id: ObjectID(id) };
        collection
          .deleteOne(query)
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// ----------------------------------------------------------------------------
// REMOVE: Xoá (nhiều)
function deleteDocuments(query, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        collection
          .deleteMany(query)
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// ----------------------------------------------------------------------------
// FIND: Tìm kiếm (id)
function findDocument(id, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        const query = { _id: ObjectID(id) };
        collection
          .findOne(query)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            reject(err);
          })
          .finally(() => {
            client.close();
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// ----------------------------------------------------------------------------
// FIND: Tìm kiếm (nhiều)
function findDocuments(query, collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((client) => {
        const dbo = client.db(DATABASE_NAME);
        const collection = dbo.collection(collectionName);
        collection
          .find(query)
          .toArray()
          .then((result) => {
            client.close();
            resolve(result);
          })
          .catch((err) => {
            console.log(err);
            client.close();
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { insertDocument, insertDocuments, updateDocument, updateDocuments, deleteDocument, deleteDocuments, findDocument, findDocuments };
