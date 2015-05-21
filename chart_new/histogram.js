//柱状图
var w = 40,
h = 400;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var y = d3.scale.linear()
    .domain([0, 50])
    .rangeRound([0, h]);

var chart = d3.select(".histogram").append("svg")
    .attr("class", "chart")
    .attr("width", w * window.freq.length - 1)
    .attr("height", h);
chart.selectAll("rect")
    .data(window.freq)
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i) - .5; })
    .attr("y", function(d) { return h - y(d) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y(d); });

function redraw1() {
chart.selectAll("rect")
    .data(window.freq)
    .transition()
    .duration(1000)
    .attr("y", function(d) { return h - y(d) - .5; })
    .attr("height", function(d) { return y(d); });
}