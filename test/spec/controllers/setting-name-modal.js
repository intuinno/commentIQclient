'use strict';

describe('Controller: SettingNameModalCtrl', function () {

  // load the controller's module
  beforeEach(module('commentiqApp'));

  var SettingNameModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingNameModalCtrl = $controller('SettingNameModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
