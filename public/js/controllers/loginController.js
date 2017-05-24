app.controller('loginCtrl', function ($scope, $http, $timeout, $window, loginService, urlFactory) {

	$scope.submitForm = function (isValid) {

		$scope.userDetails = {
			email: $scope.email,
			password: $scope.password
		};
		if (isValid) {

			loginService.login($scope.userDetails).then(
				function (data, status) {
					console.log(data);
					$scope.userDetails = data.data;
					console.log($scope.userDetails);
					if ($scope.userDetails.message) {

						//alert(data.data.message[0]);
						swal({
							title: data.data.message[0],
							type: 'warning',
							showCloseButton: true
						});
					}
				},
				function (data, status) {
					if (status == 409) {

						alert(data.data[0].message);
						swal({
							title: data.data[0].message,
							type: 'warning',
							showCloseButton: true
						});
					}

					/*swal({
	                    title: 'not able to login',
	                    type: 'warning',
	                    showCloseButton: true
	                });
	                /*$timeout(function () {
	                    $window.location.href = urlFactory.home();
	                }, 2000)*/
				}
			);
		};
	};


});