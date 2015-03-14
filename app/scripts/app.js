'use strict';

/**
 * @ngdoc overview
 * @name commentiqApp
 * @description
 * # commentiqApp
 *
 * Main module of the application.
 */
angular.module('commentiqApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'firebase',
        'firebase.utils',
        'ui.bootstrap',
        'angularUtils.directives.dirPagination',
        'ui.select',
        'simpleLogin'
    ])
    .config(function(paginationTemplateProvider) {
        paginationTemplateProvider.setPath('dirPagination.tpl.html');
    }).config(['$routeProvider', 'SECURED_ROUTES',
        function($routeProvider, SECURED_ROUTES) {

            $routeProvider.whenAuthenticated = function(path, route) {

                route.resolve = route.resolve || {};

                route.resolve.user = ['authRequired', function(authRequired) {
                    return authRequired();
                }];

                $routeProvider.when(path, route);
                SECURED_ROUTES[path] = true;

                return $routeProvider;
            };

        }
    ])
    .run(['$rootScope', '$location', 'simpleLogin', 'SECURED_ROUTES', 'loginRedirectPath',
        function($rootScope, $location, simpleLogin, SECURED_ROUTES, loginRedirectPath) {

            simpleLogin.watch(check, $rootScope);

            $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
                // if (angular.isObject(err) && err.authRequired) {
                if (err === 'AUTH_REQUIRED') {
                    $location.path(loginRedirectPath);
                }
            });

            function check(user) {
                if (!user && authRequired($location.path())) {
                    $location.path(loginRedirectPath).replace();
                }
            }

            function authRequired(path) {
                return SECURED_ROUTES.hasOwnProperty(path);
            }


        }
    ])
    .constant('SECURED_ROUTES', {});;
