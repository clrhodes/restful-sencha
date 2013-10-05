var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('test', server, {w: 1});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'test' database");
        db.collection('users', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist.");
                populateDB();
            }
        });
    }
});

exports.findUserById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.find({'parentId':id}).toArray(function(err, items) {
            console.log(JSON.stringify(items));
            res.send({success: true, data: items});
        });
    });
};

exports.findUsers = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving users');
    db.collection('users', function(err, collection) {
        collection.find({'parentId':'root'}).toArray(function(err, items) {
            items.forEach(function(item) {item.expanded = true});
            res.send({success: true, data: items});
        });
    });    
}
exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send({success: true, data: items});
        });
    });
};
 
exports.createUser = function(req, res) {
    var user = req.body;
    delete user["_id"];
    user["signupDate"] = new Date();
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.insert(user, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({success: true, data: result[0]});
            }
        });
    });
}
 
exports.updateUser = function(req, res) {
    var id = req.params.id;
    var course = req.body;
    delete course["_id"];
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(course));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, course, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send({success: true, data: course});
            }
        });
    });
}
 
exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({$or: [{'_id':new BSON.ObjectID(id)}, {parentId: id}]}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send({success: true, data: req.body});
            }
        });
    });
}

populateDB = function() {

var users = [{ "username" : "genericx",
   "password" : "password",
   "firstName" : "Veritable",
   "lastName" : "Quandary",
   "signupDate": new Date(),
   "enabled" : true},
{ "username" : "crhodes",
  "firstName" : "Christopher",
  "lastName" : "Rhodes",
  "enabled" : "on",
  "signupDate" : new Date(),
  "password" : "SysAdminsLoveTheWordGod"},
{ "username" : "dmarsland",
  "firstName" : "David",
  "lastName" : "Marsland",
  "signupDate" : new Date(),
  "enabled" : "on",
  "password" : "TheBigKahuna"},
{ "username" : "starbuxman",
  "firstName" : "Josh",
  "lastName" : "Long",
  "signupDate" : new Date(),
  "enabled" : true,
  "password" : "JavaSpring" }];

    // var users = [{
    //     username: 'genericx',
    //     password: 'password',
    //     firstName: 'Veritable',
    //     lastName: 'Quandary',
    //     signupDate: new Date(),
    //     enabled: true
    // }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {
            if (err) {
                console.log('Unable to populate database.');
            } else {
                console.log('Database populated with example set.');
            }
        });
    });

}