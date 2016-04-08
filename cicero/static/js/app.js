// we put all the js code into an anonymous function
// this is good practice to isolate the namespace
; (function() {


// with this we make js less forgiving so that we catch
// more hidden errors during development
'use strict';


var app = angular.module('app', []);


app.config(['$interpolateProvider', function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
}]);


app.controller('Ctrl', ['$scope', '$http', function($scope, $http) {

    $scope.user = '';

    $scope.repo = '';
    $scope.repos = [];
    $scope.repos_loaded = false;
    $scope.load_repos = function () {
        $scope.repos_loaded = false;
        $scope.branches_loaded = false;
        $scope.files_loaded = false;

        $http.get("https://api.github.com/users/" + $scope.user + "/repos?per_page=1000")
            .success(function(data) {
                $scope.repos = data;
                $scope.repos_loaded = true;
            })
    };

    $scope.branch = '';
    $scope.branches = [];
    $scope.branches_loaded = false;
    $scope.load_branches = function () {
        $scope.branches_loaded = false;
        $scope.files_loaded = false;

        $http.get("https://api.github.com/repos/" + $scope.user + "/" + $scope.repo.name + "/branches")
            .success(function(data) {
                $scope.branches = data;
                $scope.branches_loaded = true;
            })
    };

    $scope.file = '';
    $scope.files = [];
    $scope.files_loaded = false;
    $scope.load_files = function () {
        $scope.files_loaded = false;

        $http.get("https://api.github.com/repos/" + $scope.user + "/" + $scope.repo.name + "/git/refs/heads/" + $scope.branch.name)
            .success(function(data) {
            $http.get("https://api.github.com/repos/" + $scope.user + "/" + $scope.repo.name + "/git/trees/" + data.object.sha + "?recursive=1")
                .success(function(data2) {
                    $scope.files = data2.tree;
                    $scope.files_loaded = true;
                })
            })
    };

    $scope.link = '';
    $scope.source_link = '';
    $scope.link_generated = false;
    $scope.generate_link = function () {

        $scope.link = 'http://cicero.xyz/v2/remark/github/'
                    + $scope.user
                    + '/'
                    + $scope.repo.name
                    + '/'
                    + $scope.branch.name
                    + '/'
                    + $scope.file.path
                    + '/';

        $scope.source_link = 'https://github.com/'
                           + $scope.user
                           + '/'
                           + $scope.repo.name
                           + '/blob/'
                           + $scope.branch.name
                           + '/'
                           + $scope.file.path;

        $scope.link_generated = true;
    };

}]);


// close the anonymous function
})();
