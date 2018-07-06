"use strict";

let Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    async = require('async'),
    collection = 'labyrinths',
    getAllLabyrinths = (owner, callback) => {
        mongoServer.getCollection(collection, (error, labyrinthsCol) => {
            if (error) {
                callback(error);
            } else {
                labyrinthsCol.find({owner: ObjectID(owner)}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    },
    createLabyrinth = (labyrinthData, callback) => {
        mongoServer.getCollection(collection, (error, labyrinthsCol) => {
            if (error) {
                callback(error);
            } else {
                let dateTime = new Date();
                labyrinthData.owner = ObjectID(labyrinthData.owner);
                labyrinthData.createdAt = dateTime;
                labyrinthData.updatedAt = dateTime;
                labyrinthsCol.insert(labyrinthData, (error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        let id = results.ops ? (results.ops.length > 0 ? results.ops[0]._id : '') : '';
                        callback(null, id);

                    }
                });
            }
        });
    },
    getLabyrinthById = (id, owner, callback) => {
        mongoServer.getCollection(collection, (error, labyrinthsCol) => {
            if (error) {
                callback(error);
            } else {
                labyrinthsCol.find({_id: ObjectID(id), owner: ObjectID(owner)}, {createdAt: 0, updatedAt: 0}).toArray((error, results) => {
                    if (error) {
                        callback(error);
                    } else {
                        if(results.length) {
                            callback(null, results[0]);
                        }
                        else {
                            callback({errMsg: 'There is no labyrinth for this Id'});
                        }
                    }
                });
            }
        });
    },
    setPositionType = (reqParams, owner, callback) => {
        mongoServer.getCollection(collection, (error, labyrinthsCol) => {
            if (error) {
                callback(error);
            } else {
                let updateVal = {
                    $set: {
                        [reqParams.positionType]: {x: Number(reqParams.x), y: Number(reqParams.y)}
                    }
                };
                labyrinthsCol.update({_id: ObjectID(reqParams.id), owner: ObjectID(owner)}, updateVal, (error, result) => {
                    if (error) {
                        callback(error);
                    } else {
                        if(result.result && result.result.nModified === 1) {
                            callback(null);
                        }
                        else {
                            callback({errMsg: 'Not updated ' + reqParams.positionType});
                        }
                    }
                });
            }
        });
    },
    setBlockType = (id, blockDetails, owner, callback) => {
        mongoServer.getCollection(collection, (error, labyrinthsCol) => {
            if (error) {
                callback(error);
            } else {
                let updateSetQuery = {
                    '_id': ObjectID(id),
                    'owner': ObjectID(owner),
                    'playfield.x': blockDetails.x,
                    'playfield.y': blockDetails.y
                }, updatePushQuery = {
                    _id: ObjectID(id),
                    owner: ObjectID(owner)
                }, updateSetVal = {
                    $set: {
                        'playfield.$.type': blockDetails.type
                    }
                },
                updatePushVal = {
                    $push: {
                        playfield: blockDetails
                    }
                };
                 labyrinthsCol.find(updateSetQuery).toArray((err, results) => {
                    if(err){
                        callback(err);
                    }
                    else {
                        if(results.length){
                            labyrinthsCol.update(updateSetQuery, updateSetVal, (error, result) => {
                                if (error) {
                                    callback(error);
                                } else {
                                    if(result.result ) {
                                        callback(null);
                                    }
                                    else {
                                        callback({errMsg: 'Error while update'});
                                    }
                                }
                            });
                        }
                        else{
                            labyrinthsCol.update(updatePushQuery, updatePushVal, (error, result) => {
                                if (error) {
                                    callback(error);
                                } else {
                                    if(result.result && result.result.nModified === 1) {
                                        callback(null);
                                    }
                                    else {
                                        callback({errMsg: 'Error while updating ' + reqParams.positionType});
                                    }
                                }
                            });
                        }
                    }
                 });
            }
        });
    };

exports.getAllLabyrinths = getAllLabyrinths;
exports.createLabyrinth = createLabyrinth;
exports.getLabyrinthById = getLabyrinthById;
exports.setPositionType = setPositionType;
exports.setBlockType = setBlockType;