//饼状图
var width2 = 1000;
var height2 = 600;

var svg2 = d3.select(".pie").append("svg")
				.attr("width",width2)
				.attr("height",height2);


redraw3();
function redraw3(){

	svg2.selectAll("g").remove("g");
	var pie = d3.layout.pie().sort(null);

	//圆环外半径外半径
	var outerRadius = width2 / 4;
	//内半径
	var innerRadius = width2 / 10;

	//设置弧度的内外径，等待传入的数据生成弧度
		var arc = d3.svg.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius);
	
	var color = d3.scale.category20();
	
	var drag = d3.behavior.drag()
	.origin(function(d) { return d; })
	.on("drag", dragmove);
	//准备分组
	var gAll = svg2.append("g")
				  .attr("transform","translate("+outerRadius+","+outerRadius+")");//translate(a,b)a表示横坐标起点，b表示纵坐标起点


	//把每个分组移到图表中心			  
	var arcs = gAll.selectAll("g")
	.data(pie(freq))
	.enter()
	.append("g")
	.each(function(d){
		d.dx = 0;
		d.dy = 0;
	})
	.call(drag);
	
	//用svg的path绘制弧形的内置方法		  
	arcs.append("path")//每个g元素都追加一个path元素用绑定到这个g的数据d生成路径信息
		.attr("fill",function(d,i){//填充颜色
			return color(i);
		})
		.attr("d",function(d){//将角度转为弧度
			return arc(d);
		});
	//为组中每个元素添加文本
	arcs.append("text")//每个g元素都追加一个text元素用绑定到这个g的数据d生成路径信息
	.attr("transform",function(d){
			return "translate(" + arc.centroid(d) + ")";//计算每个弧形的中心点
		})
	.attr("text-anchor","middle")
	.text(function(d){
		return d.value;
	});
	
	console.log(freq);
	console.log(pie(freq));


	function dragmove(d) {
		d.dx += d3.event.dx;
		d.dy += d3.event.dy;
		d3.select(this)
		.attr("transform","translate("+d.dx+","+d.dy+")");
	}
}