'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:PickReasonModalCtrl
 * @description
 * # PickReasonModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('PickReasonModalCtrl', function($scope, $modalInstance, reasons) {

  $scope.reasons = reasons;
  $scope.result = {};
  
  $scope.ok = function () {
    $modalInstance.close($scope.result);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

