app.factory('urlFactory', function($window){
	
	var urlFactory = {};
	
	urlFactory.home = function(){ 
		return "http://" + $window.location.host + "/index.html"; 
	};

	return urlFactory;
	
});