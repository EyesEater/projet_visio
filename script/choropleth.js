async function choropleth(countries) {

    // The svg
    var svg = d3.select("#choropleth").append("svg").attr("width", window.innerWidth).attr("height", window.innerHeight - 20),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(300)
        //.center([width/2,height/2]);

    // Data and color scale
    //var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(async rawData => {
        ready(null, rawData)});

    function ready(error, topo) {
        console.log("test");
        let mouseOver = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")
        }

        let mouseLeave = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")
        }

        // Draw the map
        svg.append("g")
            .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                //d.total = data.get(d.id) || 0;
                return colorScale(20);
            })
            .style("stroke", "transparent")
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )

        d3.select("#choropleth").attr("width", svg.attr("width")).attr("height", svg.attr("height"))
    }
    return "Fin Choropleth";
}