'use strict';

describe('Directive: gatherplot', function () {

  // load the directive's module
  beforeEach(module('commentiqApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gatherplot></gatherplot>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gatherplot directive');
  }));
});
