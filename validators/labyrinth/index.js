let validateLabyrinthId = (reqData, callback) => {
		if(!reqData.id) {
			callback({errMsg: 'Request is not containing any id'});
		}
		else if(reqData.id.length != 24) {
			callback({errMsg: 'Id is not a mongo Id'});
		}
		else {
			callback(null);
		}
	},
	validatePositionType = (reqParams, callback) => {
        if (!reqParams.id) {
            callback({errMsg: 'Id in missing in Request Params'});
        }
        else if (!reqParams.positionType) {
            callback({errMsg: 'Type(start/end) is missing in the Request Params'});
        }
        else if (!reqParams.x || !reqParams.y) {
            callback({errMsg: 'x/y is missing in the Request Params'});
        }
        else if ( isNaN(Number(reqParams.x)) || isNaN(Number(reqParams.y))) {
        	callback({errMsg: 'x and y co-ordinate should be Numbers'});
        }
        else {
            callback(null);
        }
    },
	validateBlockType = (reqParams, callback) => {
        if (!reqParams.id) {
            callback({errMsg: 'Id in missing in Request Params'});
        }
        else if (!reqParams.type) {
            callback({errMsg: 'Type is missing in the Request Params'});
        }
        else if (!reqParams.x || !reqParams.y) {
            callback({errMsg: 'x/y is missing in the Request Params'});
        }
        else if ( isNaN(Number(reqParams.x)) || isNaN(Number(reqParams.y))) {
        	callback({errMsg: 'x and y co-ordinate should be Numbers'});
        }
        else {
            callback(null);
        }
    };
exports.validateLabyrinthId = validateLabyrinthId;
exports.validatePositionType = validatePositionType;
exports.validateBlockType = validateBlockType;