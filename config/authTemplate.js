module.exports = {

    'facebookAuth' : {
        'clientID'      : 'ur client id', // your App ID
        'clientSecret'  : 'ur clinet secret', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
        },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'ur client id',
        'clientSecret'  : 'ur client id',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};