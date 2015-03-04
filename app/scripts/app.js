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
    'angular-carousel'
  ])
.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('dirPagination.tpl.html');
});
