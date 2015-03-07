'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:HelpCriteriaModalCtrl
 * @description
 * # HelpCriteriaModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('HelpCriteriaModalCtrl', function($scope, $modalInstance, criterias) {

  $scope.criterias = criterias;
  
  $scope.ok = function () {
    $modalInstance.close();
  };

});

