var app = angular.module('greenSpace', ['ui.router']);

app.factory("posts", [function() {
	var o = {
		posts: [{title:"Welcome to my posts!", links:"", upvotes:0}]
	};
	return o;
}]);

app.controller('MainCtrl', [
'$scope',
'posts',
	function($scope, posts){
	  $scope.test = 'Hello world!';
	  $scope.posts = posts.posts;

	$scope.addPost = function() {
		if(!$scope.title || $scope.title === "") {
			alert("Please input something!")
			return;
		}
		$scope.posts.push({
			title: $scope.title,
			link: $scope.link,
			upvotes: 0
		});
		$scope.title = "";
		$scope.link = ""
	}

	$scope.incrementUpvotes = function(post) {
		post.upvotes += 1;
	}

	// $scope.decrementUpvotes = function(post) {
	// 	post.upvotes -= 1;
	// }

}]);

