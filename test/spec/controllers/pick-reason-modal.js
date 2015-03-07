'use strict';

describe('Controller: PickReasonModalCtrl', function () {

  // load the controller's module
  beforeEach(module('commentiqApp'));

  var PickReasonModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PickReasonModalCtrl = $controller('PickReasonModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
