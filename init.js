require('../server')({name:'services'}).$modules({
    import : {
        passwordValidator : 'password-validator',
        sanitizeHtml      : 'sanitize-html',
        crypto            : 'crypto',
        moment            : 'moment',
        unirest           : 'unirest',
        decache           : 'decache',
        faker             : 'faker'
    }
}).$cluster({
    master: {
        host           : 'localhost',
        port           : '3005',
        options        : {
            origins : '*:*'
        },
        events  : {
            authentication: function (arguments,success,failed) {
                //fire when worker connects and request authentication
                if(JSON.parse(arguments).key === '123456789'){
                    //If success, the response will be sent to the worker
                    success();
                }else {
                    //If failed, worker will disconnect and will message to the worker
                    failed();
                }
            },
            connect: function (worker) {
                //fire when worker connected after authentication
            },
            disconnected: function (worker) {
                //fire when worker disconnected
            },
            client: {
                connect:function (client) {
                    //fire when client connects to the cluster

                    //console.log($methods.customers.test('test2'))
                    //console.log('client conncted', client);
                    client.emit('emit','test');
                    //$cluster.emit('emit',client.id,{})
                },
                disconnected:function (client) {
                    //fire when client disconnects from the cluster
                }
            }
        }
    }
}).$database({
    mongo : {
        master : {
            ip          : 'localhost',
            port        : '27017',
            database    : 'admin',
            username    : 'myUserAdmin',
            password    : 'abc123',
            options     : '',
            events      : {
                connect : function(db){
                },
                reconnect : function (db) {

                },
                disconnect : function (db) {

                },
                error : function (db) {

                },
                watch:function (results) {
                    //watch for mongo events
                }
            },
            load : {
                //Load the selected documents into the server
                boosts : 'settings.boosts'
            }
        },
        remote : {
            ip          : 'localhost',
            port        : '27017',
            database    : 'admin',
            username    : 'myUserAdmin',
            password    : 'abc123',
            options     : '',
            events      : {
                connect : function(db){
                },
                reconnect : function (db) {

                },
                disconnect : function (db) {

                },
                error : function (db) {

                },
                watch:function (results) {
                    //watch for mongo events
                }
            },
            load : {
                //Load the selected documents into the server
                boosts : 'settings.boosts'
            }
        }
    }
}).$database({
    elasticsearch : {
        master : {
            username : '',
            password : '',
            port     : 9200,
            hosts    : String('localhost').split(','),
            protocol : 'http',
            indices  : {
                customers :{
                    customer:{
                        body:{
                            id:'' , username:'' , geo_point :[],name:'',email:'',phone:'',city:'',state:'',country:'',ip:'',created:''
                        },
                        mapping:{
                            properties: {
                                'geo_point' : {type: 'geo_point'},
                                'date'      : {type: 'date'}
                            }
                        }
                    }
                }
            }

        }
    }
}).$classes({
    global : {
        $mongo  : { path: './classes/mongo'}
    }
}).$finally(async function () {

});


