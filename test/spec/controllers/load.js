'use strict';

describe('Controller: LoadCtrl', function () {

  // load the controller's module
  beforeEach(module('commentiqApp'));

  var LoadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoadCtrl = $controller('LoadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
