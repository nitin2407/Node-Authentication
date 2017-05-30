app.service('loginService',function($http){	
    
    this.login2 = function(email,password){
        return $http.post('/login/'+ email + '/' + password);
    };

    this.login = function(obj){
        return $http.post('/login', obj);
    };

    this.fblogin = function(){
        return $http.get('/auth/facebook');
    }

    this.googlelogin = function(){
        return $http.get('/auth/google');
    }

});