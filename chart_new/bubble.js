//泡泡图
var width = 1000,
height = 800,
padding = 1, // 相同颜色结点之间距离
clusterPadding = 20, // 不同颜色结点之间距离
maxRadius = 20;

var svg1 = d3.select(".bubble").append("svg")
			.attr("width", width)
			.attr("height", height);

var n; // 所有节点数
var m = 26; // 聚类的个数

var color = d3.scale.category20()
		.domain(d3.range(m));

// 代表每个聚类的最大半径结点
var clusters = new Array(m);
//clusters[0].radius=2;

var calculate1=0;
var calculate2=m-1;

var nodes=[];
var node=[];

redraw2();

function redraw2(){
	//init
	clusters=[];
	nodes=[];
	n=window.total;
	calculate1=0;
    calculate2=m-1;
    //清空svg
	svg1.selectAll("circle").remove("circle");

	//重新载入数据
	nodes = d3.range(n).map(function() {
	  //Math.floor是小于等于参数的最大整数
	  //Math.random产生0~1之间的随机数
	  if (calculate1==freq[calculate2]) {
	  	//console.log(freq[calculate2]);
	  	calculate2--;
	  	calculate1=0;
	  };
	  var i = calculate2;
	  var r = Math.random() * maxRadius;
	  var d = {cluster: i, radius: r};
	  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
	  calculate1++;
	  return d;
	});

	//console.log(clusters.length);

	d3.layout.pack()
			.sort(null)
			.size([width, height])
		    .children(function(d) { return d.values; }) //设置或获取子结点的访问函数
		    .value(function(d) { return d.radius * d.radius; })//获取或设置size circles的值的访问
		    //计算包布局并返回结点数组（运行包布局，返回与指定根节点相关联的节点的数组。输入参数到布局是层次的根节点，并且输出返回值是一个代表所有节点的所计算的位置的阵列。几个属性填充每个节点上：parent、children、value、depth、x、y、r）
		    .nodes({values: d3.nest()
		    	.key(function(d) { return d.cluster; })
		    	.entries(nodes)});

	var force = d3.layout.force()
					.nodes(nodes)
					.size([width, height])
					.gravity(.02)
					.charge(0)
					.on("tick", tick)
					.start();

	node = svg1.selectAll("circle")
					.data(nodes)
					.enter().append("circle")
					//enter使data的每个数据都执行一次.style .call .transition .duration .delay .atterTween
					.style("fill", function(d) { return color(d.cluster); })
					.call(force.drag);

	node.transition()
		.duration(500)//每个元素的持续时间
		.delay(function(d, i) { return i * 5; })//每个元素的延迟
		.attrTween("r", function(d) {
			var i = d3.interpolate(0, d.radius);
			return function(t) { return d.radius = i(t); };
		});


}

//时钟函数
function tick(e) {
	node
	.each(cluster(10 * e.alpha * e.alpha))
	.each(collide(.5))
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; });
}

// 将d移至聚集结点旁边
function cluster(alpha) {
	return function(d) {
		var cluster = clusters[d.cluster];
		if (cluster === d) return;
		var x = d.x - cluster.x,
		y = d.y - cluster.y,
		l = Math.sqrt(x * x + y * y),
		r = d.radius + cluster.radius;
		if (l != r) {
			l = (l - r) / l * alpha;
			d.x -= x *= l;
			d.y -= y *= l;
			cluster.x += x;
			cluster.y += y;
		}
	};
}

// d和其他圆圈之间的碰撞
function collide(alpha) {
	var quadtree = d3.geom.quadtree(nodes);
	return function(d) {
		var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
		nx1 = d.x - r,
		nx2 = d.x + r,
		ny1 = d.y - r,
		ny2 = d.y + r;
		quadtree.visit(function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== d)) {
				var x = d.x - quad.point.x,
				y = d.y - quad.point.y,
				l = Math.sqrt(x * x + y * y),
				r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
				if (l < r) {
					l = (l - r) / l * alpha;
					d.x -= x *= l;
					d.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
			return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		});
	};
}