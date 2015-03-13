'use strict';
/**
 * @ngdoc overview
 * @name commentiqApp:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 */
angular.module('commentiqApp')

// configure views; the authRequired parameter is used for specifying pages
// which should only be available while logged in
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })
        .whenAuthenticated('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountCtrl'
        })
        .when('/browse', {
            templateUrl: 'views/browse.html',
            controller: 'BrowseCtrl'
        })
        .whenAuthenticated('/load', {
            templateUrl: 'views/load.html',
            controller: 'LoadCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
