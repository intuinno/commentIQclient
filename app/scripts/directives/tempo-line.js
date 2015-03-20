'use strict';

/**
 * @ngdoc directive
 * @name commentiqApp.directive:tempoLine
 * @description
 * # tempoLine
 */
angular.module('commentiqApp')
    .directive('tempoLine', function() {

        return {
            restrict: 'EAC',
            scope: {
                data: "=",
                config: "=",
                context: "="
            },

            link: function postLink(scope, element, attrs) {

                // var trendData = parseData(scope.data);

                var data;

                scope.$watch('data', function(newVals, oldVals) {

                    if (newVals.length > 0) {

                        return scope.renderDataChange(newVals);

                    } else {

                        return
                    }


                }, true);

                scope.$watch(function() {
                    return angular.element(window)[0].innerWidth;
                }, function() {
                    return parseData(data);
                });

                scope.renderDataChange = function(newVals) {

                    data = angular.copy(newVals);

                    parseData(data);

                }

                var width, height;

                var chart = barChart();

                // update();

                // function update() {

                //     width = d3.select(element[0]).node().parentNode.parentNode.offsetWidth;
                //     height = width * 0.7;

                //     // chart.size([width, height]);

                //     // domParent.call(chart);

                // }

                function parseData(data) {

                    if (!data || data.length === 0) {
                        return;
                    }

                    width = d3.select(element[0]).node().parentNode.parentNode.offsetWidth;
                    height = width * 0.7;

                    data.forEach(function(d, i) {

                        d.date = new Date(d.ApproveDateConverted * 1000);


                    });
                    var trendCrossFilter = crossfilter(data),
                        date = trendCrossFilter.dimension(function(d) {
                            return d.date;
                        }),
                        dates = date.group(d3.time.hour);

                    chart = barChart()
                        .dimension(date)
                        .group(dates)
                        .round(d3.time.hour.round)
                        .x(d3.time.scale()
                            .domain(d3.extent(data, function(d) {
                                return d.date;
                            }))
                            .rangeRound([0, width - 100]))
                        .filter(d3.extent(data, function(d) {
                            return d.date;
                        }))
                        .on("brush", render)
                        .on("brushend", render)

                    var domParent = d3.select(element[0])
                        .call(chart);

                }

                function render() {

                    console.log("I'm here");



                }



            }
        };
    });



function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {
            top: 100,
            right: 10,
            bottom: 50,
            left: 10
        },
        x,
        y = d3.scale.linear().range([200, 0]),
        id = barChart.id++,
        // axis = d3.svg.axis().orient("bottom").tickFormat(d3.time.format("%I%p, %d")),
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
        var width = x.range()[1],
            height = y.range()[0];

        y.domain([0, group.top(1)[0].value]);

        div.each(function() {
            var div = d3.select(this);

            div.selectAll('*').remove();

            var g = div.select("g");

            // Create the skeletal chart.
            if (g.empty()) {
                div.select(".title").append("a")
                    .attr("href", "javascript:reset(" + id + ")")
                    .attr("class", "reset")
                    .text("reset")
                    .style("display", "none");

                g = div.append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                g.append("clipPath")
                    .attr("id", "clip-" + id)
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                g.selectAll(".bar")
                    .data(["background", "foreground"])
                    .enter().append("path")
                    .attr("class", function(d) {
                        return d + " bar";
                    })
                    .datum(group.all());

                g.selectAll(".foreground.bar")
                    .attr("clip-path", "url(#clip-" + id + ")");

                g.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(axis);

                // Initialize the brush component with pretty resize handles.
                var gBrush = g.append("g").attr("class", "brushTempo").call(brush);
                gBrush.selectAll("rect").attr("height", height);
                gBrush.selectAll(".resize").append("path").attr("d", resizePath);
            }

            // Only redraw the brush if set externally.
            if (brushDirty) {
                brushDirty = false;
                g.selectAll(".brushTempo").call(brush);
                div.select(".title a").style("display", brush.empty() ? "none" : null);
                if (brush.empty()) {
                    g.selectAll("#clip-" + id + " rect")
                        .attr("x", 0)
                        .attr("width", width);
                } else {
                    var extent = brush.extent();
                    g.selectAll("#clip-" + id + " rect")
                        .attr("x", x(extent[0]))
                        .attr("width", x(extent[1]) - x(extent[0]));
                }
            }

            g.selectAll(".bar").attr("d", function(d) {
                return barPath(d, width)
            });
        });

        function barPath(groups, width) {
            var path = [],
                i = -1,
                n = groups.length,
                d,
                barWidth;

            barWidth = width / n - 4;

            while (++i < n) {
                d = groups[i];
                path.push("M", x(d.key), ",", height, "V", y(d.value), "h", barWidth, "V", height);
            }
            return path.join("");
        }

        function resizePath(d) {
            var e = +(d == "e"),
                x = e ? 1 : -1,
                y = height / 3;
            return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) + "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
        }
    }

    brush.on("brushstart.chart", function() {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
        var g = d3.select(this.parentNode),
            extent = brush.extent();
        if (round) g.select(".brushTempo")
            .call(brush.extent(extent = extent.map(round)))
            .selectAll(".resize")
            .style("display", null);
        g.select("#clip-" + id + " rect")
            .attr("x", x(extent[0]))
            .attr("width", x(extent[1]) - x(extent[0]));
        dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
        if (brush.empty()) {
            var div = d3.select(this.parentNode.parentNode.parentNode);
            div.select(".title a").style("display", "none");
            div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
            dimension.filterAll();
        }
    });

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        axis.scale(x);
        brush.x(x);
        return chart;
    };

    chart.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return chart;
    };

    chart.dimension = function(_) {
        if (!arguments.length) return dimension;
        dimension = _;
        return chart;
    };

    chart.filter = function(_) {
        if (_) {
            brush.extent(_);
            dimension.filterRange(_);
        } else {
            brush.clear();
            dimension.filterAll();
        }
        brushDirty = true;
        return chart;
    };

    chart.group = function(_) {
        if (!arguments.length) return group;
        group = _;
        return chart;
    };

    chart.round = function(_) {
        if (!arguments.length) return round;
        round = _;
        return chart;
    };



    return d3.rebind(chart, brush, "on");
};
