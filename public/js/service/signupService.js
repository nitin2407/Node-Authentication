app.service('signupService',function($http){	

    this.signup = function(obj){
        return $http.post('/signup', obj);
    };

});