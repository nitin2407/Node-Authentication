angular.module('AdminHome')
	.controller('EmpCtrl', function ($scope, $http, $window,$timeout,empService) {

  
    $scope.submitForm = function (isValid) {
    
    	if(isValid){
    	
			empService.getEmpById($scope.empId).then(
	            function (empDetails) {
						console.log(empDetails);
	                    $scope.empDetails = empDetails.data[0];
						console.log($scope.empDetails);
	                    $scope.firstName =  $scope.empDetails.first_nm;
	                    $scope.middleName =  $scope.empDetails.middleName;
	                    $scope.lastName =  $scope.empDetails.last_nm;
	                    $scope.dob =  $scope.empDetails.dob;
	                    $scope.maritalStatus =  $scope.empDetails.maritalStatus;
	                    $scope.empType =  $scope.empDetails.empType;
	                    $scope.empDesignation =  $scope.empDetails.empDesignation;              
	                    $scope.title =  $scope.empDetails.title;
	                    $scope.workAuthorization =  $scope.empDetails.work_authorization_ind;
	                    $scope.startDate =  $scope.empDetails.startDate;
	                    $scope.endDate =  $scope.empDetails.endDate;
	            },
	            function (data, status) {
	                swal({
	                    title: 'not able to retrieve emp details',
	                    type: 'warning',
	                    showCloseButton: true
	                });
	                $timeout(function () {
	                    //$window.location.href = urlFactory.home();
	                }, 2000)
	            }
	        );
		};
    };
});

