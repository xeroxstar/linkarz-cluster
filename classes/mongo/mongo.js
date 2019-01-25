
function mongo() {
}

mongo.prototype.find = function(QUERY){
    if(QUERY.options === undefined){
        QUERY.options = {};
    }
    QUERY.options.watch = $database.watch;

    if(QUERY.start === undefined){
        QUERY.start = 0;
    }

    if(QUERY.count === undefined){
        QUERY.count = 0;
    }

    if(QUERY.sort === undefined){
        QUERY.sort = { "$natural": 1 };
    }

    $database.mongo.master
        .collection(QUERY.collection)
        .find      ((QUERY.data !== undefined?QUERY.data:QUERY.find !== undefined?QUERY.find:{}), QUERY.options)
        .sort      (QUERY.sort)
        .skip      (QUERY.start)
        .limit     (QUERY.count)
        .toArray(async function (err, res) {QUERY.callback(err ? err : res);});
}
mongo.prototype.collection = function(QUERY){
    return $database.mongo.master.collection(QUERY)
}

mongo.prototype.insert = function(QUERY,callback) {
    if(QUERY.options === undefined){
        QUERY.options = {};
    }
    QUERY.options.watch = $database.watch;

    $database.mongo.master.createCollection(QUERY.collection, function (err, res) {
        $database.mongo.master.collection(QUERY.collection).insertOne(QUERY.data,QUERY.options,async function (err, res) {
            if (err) throw err;
            try {
                await callback(res);
            } catch (error) {
                error.data    = QUERY;
                error.callback = callback;
            }
        });
    });
}

mongo.prototype.findOneAndUpdate = function(QUERY) {
    QUERY.options = {watch : $database.watch};
    $database.mongo.master.collection(QUERY.collection).findOneAndUpdate(QUERY.find,QUERY.update,QUERY.options !== undefined?QUERY.options:{},QUERY.callback);
}

mongo.prototype.ObjectId = function(QUERY) {
    ObjectID = $modules.mongo.ObjectID;
    return new ObjectID(QUERY);
}
module.exports = mongo;