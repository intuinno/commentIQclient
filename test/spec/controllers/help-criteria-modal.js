'use strict';

describe('Controller: HelpCriteriaModalCtrl', function () {

  // load the controller's module
  beforeEach(module('commentiqApp'));

  var HelpCriteriaModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HelpCriteriaModalCtrl = $controller('HelpCriteriaModalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
