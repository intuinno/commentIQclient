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

                chart.addBrush();

                chart.on('brushing', function(brush) {
                    console.log(JSON.stringify(brush.extent()));
                });

                var mapCrossfilter = crossfilter();

                mapCrossfilter.add(scope.data);

                var location = mapCrossfilter.dimension(function(d) {
                    return [d.Latitude, d.Longitude];
                });

                var filterLocation = function(area) {

                    var longtitudes = [area[0][0], area[1][0]];
                    var latitudes = [area[0][1], area[1][1]];

                    location.filterFunction(function(d) {
                        return d[0] >= longitudes[0] && d[0] <= longitudes[1] && d[1] >= latitudes[0] && d[1] <= latitudes[1];
                    });

                    return location.top(Infinity);

                };

                function resize() {

                    width = d3.select(element[0]).node().offsetWidth;
                    height = width * 0.7;

                    chart.scale(width)
                        .size([width, height]);

                    svg.attr('width', width)
                        .attr('height', height)
                        .call(chart);

                    // chart.reset();

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
        force,
        legend,
        stateGroup,
        nodeGroup,
        legendGroup,
        x1, x2, y1, y2, brushX, brushY;

    var legendRectSize = 18; // NEW
    var legendSpacing = 4;

    function exports(_selection) {

        svg = _selection;

        var container = svg.append("g").classed("container-group", true);
        container.append("g").classed("map-group", true);
        container.append("g").classed("comment-group", true);
        container.append("g").classed("legend-group", true);


        svg.datum([]);

        projection = d3.geo.albersUsa()
            .scale(scale)
            .translate([size[0] / 2, size[1] / 2]);

        path = d3.geo.path()
            .projection(projection);

        exports.drawLegends();

        //Get the longitude of the top left corner of our map area.
        var long1 = projection.invert([0, 0])[0];
        //Get the longitude of the top right corner of our map area.
        var long2 = projection.invert([size[0], 0])[0];

        //Get the latitude of the top left corner of our map area.
        var lat1 = projection.invert([0, 0])[1];
        //Get the latitude of the bottom left corner of our map area.
        var lat2 = projection.invert(size)[1];

        //Create a linear scale generator for the x of our brush.
        brushX = d3.scale.linear()
            .range([0, size[0]])
            .domain([long1, long2]);

        //Create a linear scale generator for the y of our brush.
        brushY = d3.scale.linear()
            .range([0, size[1]])
            .domain([lat1, lat2]);

        //Create our brush using our brushX and brushY scales.
        brush = d3.svg.brush()
            .x(brushX)
            .y(brushY)
            .on('brush', function() {
                dispatch.brushing(brush);
            });

    }

    exports.drawLegends = function() {



        var statusArray = ['New', 'Accepted', 'Rejected', 'Picked'];

        svg.select('.legend-group')
            .selectAll('*').remove();


        legend = svg.select('.legend-group')
            .selectAll('.legend') // NEW
            .data(statusArray) // NEW
            .enter() // NEW
            .append('g') // NEW
            .attr('class', 'legend') // NEW
            .attr('transform', function(d, i) { // NEW
                var height = legendRectSize + legendSpacing; // NEW
                var offset = size[0] / statusArray.length;
                var vert = size[1] - height; // NEW
                var horz = i * offset; // NEW
                return 'translate(' + horz + ',' + vert + ')'; // NEW
            }); // NEW

        legend.append('rect') // NEW
            .attr('width', legendRectSize) // NEW
            .attr('height', legendRectSize) // NEW
            .attr('class', function(d) {

                return "commentMapMark " + d;
            })

        legend.append('text') // NEW
            .attr('x', legendRectSize + legendSpacing) // NEW
            .attr('y', legendRectSize - legendSpacing) // NEW
            .text(function(d) {
                return d;
            }); // NEW

    }

    exports.drawStates = function(_data) {
        svg.select('.map-group')
            .selectAll('*').remove();

        svg.select('.map-group')
            .append('path')
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

        var node = svg.select('.comment-group')
            .selectAll('.commentMapMark')
            .data(dataOnScreen, function(d) {
                return d.CommentSequence;
            });

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



    };

    exports.addBrush = function() {

        svg.append('g')
            .attr('class', 'brush')
            .call(brush)
            .selectAll('rect')
            .attr('width', size[0]);

        return this;
    };



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
