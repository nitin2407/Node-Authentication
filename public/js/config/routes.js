var app = angular.module('myApp');

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'index.html',
            controller: 'loginController'
        })

        .state('signup', {
            url: '/signup',
            templateUrl: 'html/signup.html',
            controller: 'signupController'
        })

        /*.state('home'), {
            url: '/home',
            templateUrl: 'html/home.html',
            controller: 'homeController'
        }*/

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});