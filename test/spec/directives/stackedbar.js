'use strict';

describe('Directive: stackedBar', function () {

  // load the directive's module
  beforeEach(module('commentiqApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stacked-bar></stacked-bar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stackedBar directive');
  }));
});
