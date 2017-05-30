module.exports = {

    'facebookAuth' : {
        'clientID'      : '125720934659467', // your App ID
        'clientSecret'  : '0de63398d4ad53635e1c8f1e115d417e', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};