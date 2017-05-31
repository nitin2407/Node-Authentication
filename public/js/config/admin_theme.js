angular.module('AdminHome')
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default': '400', 
                'hue-1': '50', 
                'hue-2': '800', 
                'hue-3': '900' 
            })
    })