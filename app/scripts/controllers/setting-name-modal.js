'use strict';

/**
 * @ngdoc function
 * @name commentiqApp.controller:SettingNameModalCtrl
 * @description
 * # SettingNameModalCtrl
 * Controller of the commentiqApp
 */
angular.module('commentiqApp')
  .controller('settingNameModalCtrl', function($scope, $modalInstance, settingName) {

  $scope.settingName = 'Copy of ' + settingName;
  
  $scope.ok = function () {
    $modalInstance.close($scope.settingName);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

