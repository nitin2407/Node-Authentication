angular.module('AdminHome')
    .service('empService', function ($http) {

        this.getEmps = function () {
            return $http.get('/emps');
        };

        this.getEmpById = function (empId) {
            return $http.get('/employee/' + empId);
        };

    });