'use strict';

describe('Directive: tempoLine', function () {

  // load the directive's module
  beforeEach(module('commentiqApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tempo-line></tempo-line>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tempoLine directive');
  }));
});
