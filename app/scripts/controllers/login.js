'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('LoginCtrl',  function ($scope, simpleLogin, $location) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.login(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      simpleLogin.anonymousLogin({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      simpleLogin.passwordLogin({email: email, password: pass}, {rememberMe: true}).then(
        redirect, showError
      );
    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        simpleLogin.createAccount(email, pass, {rememberMe: true})
          .then(redirect, showError);
      }
    };
    

    function redirect() {
      $location.path('/browse');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
