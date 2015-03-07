'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:gathermap
 * @description
 * # gathermap
 */
angular.module('commentiqApp')
    .directive('gathermap', function() {
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
                    height = width * 0.7;

                var mapData;

                var chart = d3.intuinno.gathermap()
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


d3.intuinno = {};

d3.intuinno.gathermap = function module() {

    var dispatch = d3.dispatch('hover', 'drawEnd', 'brushing'),
        projection,
        path,
        t,
        s,
        svg,
        center,
        scale,
        size,
        brush,
        force;

    function exports(_selection) {

        svg = _selection;

        svg.datum([]);

        projection = d3.geo.albersUsa()
            .scale(scale)
            .translate([size[0] / 2, size[1] / 2]);

        path = d3.geo.path()
            .projection(projection);


    }

    exports.drawStates = function(_data) {
        svg.append('path')
            .attr('class', 'state')
            .datum(topojson.mesh(_data, _data.objects.states))
            .attr("d", path);
    }

    exports.drawComments = function(_data) {

        var dataOnScreen = _data.filter(function(d) {
            return projection([+d.Longitude, +d.Latitude]);
        });


        force = d3.layout.force()
            .nodes(dataOnScreen)
            .links([])
            .gravity(0)
            .charge(-3)
            .on('tick', tick)
            .theta(0.8)
            .chargeDistance(30)
            .start();

        var node = svg.selectAll('.commentMapMark')
            .data(dataOnScreen);

            node.exit().remove();

            node.enter()
            .append('circle');

            node.attr('cx', function(d) {
                return 0;
            })
            .attr('cy', function(d) {
                return 0;
            })
            .attr('r', 1)
            .attr('class', function(d) {

            	return "commentMapMark " + d.status;
            })
            .on('mouseover', dispatch.hover)
            .call(force.drag);

        function tick(e) {
            var k = .9 * e.alpha;

            node
                .attr("cx", function(o) {
                    return o.x += (projection([o.Longitude, o.Latitude])[0] - o.x) * k;
                })
                .attr("cy", function(o) {
                    return o.y += (projection([o.Longitude, o.Latitude])[1] - o.y) * k;
                });
        }



    }



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
