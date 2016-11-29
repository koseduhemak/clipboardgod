"use strict";
app.controller("clipboardController", function($scope, $location){

	$scope.table_name = "clipboard";
	$scope.primary_key = "id";

	//List
	$scope.list = function(){
		basel.database.runAsync("SELECT * FROM "+$scope.table_name+" ORDER BY id DESC", function(data){
			$scope.items = data;
		});
	}

	//Saving
	$scope.save = function(){
		if($scope.form[$scope.primary_key]){
			//Edit
			var id = $scope.form[$scope.primary_key];
			delete $scope.form[$scope.primary_key];
			delete $scope.form.$$hashKey; //Apaga elemento $$hashKey do objeto
			basel.database.update($scope.table_name, $scope.form, {id: id}); //entidade, dados, where
		}else{
			//new
			basel.database.insert($scope.table_name, $scope.form); // entidade, dados
		}
		$scope.form = {};
		$scope.list();
		$('#clipboardController').modal('hide');
	}

	// Cancel form
	$scope.cancel = function(){
		$scope.form = {};
	}

	//Abrindo para editar
	$scope.edit = function(data){
		$scope.form = data;
		$('#clipboardController').modal('show');
	}

	//Excluindo
	$scope.delete = function(data){
		if(confirm("Are you sure?")){
			basel.database.delete($scope.table_name, {id: data[$scope.primary_key]});
			$scope.list();
		}
	}
});


app.filter("trust", ['$sce', function($sce) {
	return function(htmlCode){
		return $sce.trustAsHtml(htmlCode);
	}
}]);

app.filter('dateToISO', function() {
	return function(input) {
		var res = new Date(input);
		console.log(res);
		console.log(res.getTime());
		return res;
	};
});