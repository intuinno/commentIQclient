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
    'angularUtils.directives.dirPagination'
  ])
.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('bower_components/angular-utils-pagination/dirPagination.tpl.html');
});
