angular.module('AdminHome')
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'html/emp-search.html',
                controller: 'EmpCtrl'
            })

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

    });