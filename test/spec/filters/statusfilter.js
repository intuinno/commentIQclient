'use strict';

describe('Filter: statusFilter', function () {

  // load the filter's module
  beforeEach(module('commentiqApp'));

  // initialize a new instance of the filter before each test
  var statusFilter;
  beforeEach(inject(function ($filter) {
    statusFilter = $filter('statusFilter');
  }));

  it('should return the input prefixed with "statusFilter filter:"', function () {
    var text = 'angularjs';
    expect(statusFilter(text)).toBe('statusFilter filter: ' + text);
  });

});
