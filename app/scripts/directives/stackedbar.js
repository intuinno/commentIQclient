'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:stackedBar
 * @description
 * # stackedBar
 */
angular.module('commentiqApp')
  .directive('stackedBar', function () {
    return {
      restrict: 'EAC',
                  scope: {
                data: "=",
                config: "=",
                context: "="
            },

            link: function postLink(scope, element, attrs) {

                scope.$watch('data', function(newVals, oldVals) {

                    return scope.renderDataChange();

                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return resize();
                });


                scope.renderDataChange = function() {

                    chart.drawComments(scope.data);

                }

                var width = d3.select(element[0]).node().offsetWidth,
                    height = width * 0.1;

                var mapData;

                var chart = d3.intuinno.stackedBar()
                    .scale(width)
                    .size([width, height]);

                var svg = d3.select(element[0])
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .call(chart);

                d3.json('data/us.json', function(error, us) {

                    chart.drawStates(us);
                    mapData = us;

                });

                function resize() {

                    width = d3.select(element[0]).node().offsetWidth;
                    height = width * 0.7;

                    chart.scale(width)
                        .size([width, height]);

                    svg.attr('width', width)
                        .attr('height', height)
                        .call(chart);

                    chart.reset();

                    chart.drawStates(mapData);

                    chart.drawComments(scope.data);
                }

            }
        };
    });

d3.intuinno = d3.intuinno || {};

d3.intuinno.stackedBar = function module() {

    var margin = {top:20, right: 20, bottom:40, left: 40},
    	width = 500,
    	height = 50,
    	gap = 0, 
    	ease = 'bounce';

    var svg;

    var dispatch = d3.dispatch('customHover');

    function exports(_selection) {

        _selection.each(function(_data) {

        	var chartW = width - margin.left - margin.right, 
        		chartH = height - margin.top - margin.bottom;

        	// var x1 = d3.scale.linear()
        	// 		.domain([0, ])
        })


    }

    // function getSum(data) {

    // 	var sum = d3.sum(data, function(d) { };
    // }

   

    exports.center = function(_x) {

        if (!arguments.length) return center;

        center = _x;
        return this;
    };

    exports.scale = function(_x) {

        if (!arguments.length) return scale;

        scale = _x;
        return this;
    };

    exports.size = function(_x) {

        if (!arguments.length) return size;

        size = _x;
        return this;
    };

    exports.reset = function(_x) {

        svg.selectAll('*').remove();
    };

    d3.rebind(exports, dispatch, 'on');
    return exports;

};