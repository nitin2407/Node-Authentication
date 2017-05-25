app.controller('signupCtrl', function ($scope, signupService, urlFactory,$state) {

	$scope.submitForm = function (isValid) {

		$scope.userDetails = {
            fname: $scope.fname,
            lname: $scope.lname,
			email: $scope.email,
			password: $scope.password
		};
		if (isValid) {

			signupService.signup($scope.userDetails).then(
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
					}else{
                        $state.go('home');
                    }
				},
				function (data, status) {
					//if (status == 409) {
						swal({
							title: data.data.message[0],
							type: 'warning',
							showCloseButton: true
						});
					//}
				}
			);
		};
	};


});