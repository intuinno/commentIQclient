'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:selectOnClick
 * @description
 * # selectOnClick
 */
angular.module('commentiqApp')
  .directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});

