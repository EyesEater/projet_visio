async function treemap(artistes, genres) {
    let data = {"name":"genres",
        "children": [],
        "value": 10
    };
    for (let elem in genres) {
        let children = [];
        for (value in genres[elem]) {
            children.push({
                "name": genres[elem][value],
                "value": 10
            });
        }

        data["children"].push({
            "name": elem,
            "children": children,
            "value": 10
        });
    }
    console.log(data);
    console.log(JSON.stringify(data));

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;

    var svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var root = d3.hierarchy(data).sum(function(d){ return Math.random()*10});

    d3.treemap()
        .size([width, height])
        .padding(2)
        (root);

    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "slateblue")

    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", "white")
}