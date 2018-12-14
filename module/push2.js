module.exports = {

    test: function(push_title, push_content, user_id) {

        const FCM = require('fcm-push');
        const pool = require('./config/db_pool');
        const serverKey = 'AAAA__aQAcU:APA91bER0WFNouClivVF-DjTwuRmc1Z5KQhQ3qUVb7kAzuIcWY5kYS_CMx7wDAXjmhnHhYL4BZRDfPHm1zdxMq53pcmIJzdW-l2nZ-zl4VjT0Ywb-GwppGcHq_LIPLKBJsmQ5KXW1PDi';
        pool.getConnection(function(error, connection){
            if(error) {
                console.log("getConnection Error" + error);
            }
            else {
                connection.query('select push_token from user where user_id = ?', [user_id], function(error, result2) {
                    if(error){
                        console.log("update Error" + error);
                    }else{
                        var fcm = new FCM(serverKey);
                        console.log('pushtoken : '+result2[0].push_token );
                        var message = {
                            to: result2[0].push_token,
                            collapse_key: 'a'+Math.round(Math.random()*1000000000),
                            data: {
                                testkey: 'testvalue'
                            },
                            notification: {
                                title: push_title,
                                body: push_content
                            }
                        };

                        //callback style
                        fcm.send(message, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                                console.log(err);
                            } else {
                                console.log("Successfully sent with response: ", response);
                            }
                        });
                    }
                });
            }
            connection.release();
        });
        return "HELLO";
    },

    sayHelloInSpanish: function() {
        return "Hola";
    }
};