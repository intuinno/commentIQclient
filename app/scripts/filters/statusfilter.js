'use strict';

/**
 * @ngdoc filter
 * @name commentiqApp.filter:statusFilter
 * @function
 * @description
 * # statusFilter
 * Filter in the commentiqApp.
 */
angular.module('commentiqApp')
  .filter('statusFilter', function () {
    return function (input, status) {
    	
    	var output = input.filter(function(d) {

    		if (d.status === status) {
    			return true;
    		} else {
    			return false;
    		}
    	});

      return output;
    };
  });

