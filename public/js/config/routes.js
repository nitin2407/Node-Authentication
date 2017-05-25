var app = angular.module('myApp');

app.config(function ($stateProvider,$urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider

        .state('login',{
            url: '/login',
            templateUrl: 'index.html',
            controller: 'loginController'
        })

        .state('signup',{
            url: '/signup',
            templateUrl: 'html/signup.html',
            controller: 'signupController'
        })

        .state('home'),{
            url: '/home',
            templateUrl: 'html/home.html',
            controller: 'homeController' 
        }

});