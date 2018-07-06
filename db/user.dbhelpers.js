"use strict";

let Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    mongoServer = require(__base + 'db/dbServer.js'),
    collection = 'users',
    getUsersByName = (name, callback) => {
        mongoServer.getCollection(collection, (error, userCol) => {
            if (error) {
                callback(error);
            } else {
                let query = {
                        name: name
                    };
                userCol.find(query, {_id: 1}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },
    getUserById = (id, callback) => {
        mongoServer.getCollection(collection, (error, userCol) => {
            if (error) {
                callback(error);
            } else {
                let query = {
                        _id: ObjectID(id)
                    };
                userCol.find(query, {_id: 1, name: 1}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },
    getUsersByNameAndPw = (name, pw, callback) => {
        mongoServer.getCollection(collection, (error, userCol) => {
            if (error) {
                callback(error);
            } else {
                let query = {
                        name: name,
                        pw: pw
                    };
                userCol.find(query, {_id: 1}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },
    getAllUsers = (callback) => {
        mongoServer.getCollection(collection, (error, userCol) => {
            if (error) {
                callback(error);
            } else {
                userCol.find({}, {name: 1}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },
    createUser = (name, pw, callback) => {
        mongoServer.getCollection(collection, (error, userCol) => {
            if (error) {
                callback(error);
            } else {
                let dateTime = new Date(),
                    userData = {
                        name: name,
                        pw: pw,
                        createdAt: dateTime,
                        updatedAt: dateTime
                    };
                userCol.insert(userData, (error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        let id = results.ops ? (results.ops.length > 0 ? results.ops[0]._id : '') : '';
                        callback(null, id);

                    }
                });
            }
        });
    };
exports.getUsersByName = getUsersByName;
exports.createUser = createUser;
exports.getAllUsers = getAllUsers;
exports.getUsersByNameAndPw = getUsersByNameAndPw;
exports.getUserById = getUserById;