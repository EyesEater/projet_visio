async function choropleth(genresFiltered, artistes, countries) {

    // The svg
    var svg = d3.select("#choropleth")
            .append("svg")
            .attr("width", window.innerWidth).attr("height", window.innerHeight - 20),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(window.innerWidth/10)
        .center([0, 40])
        .translate([width/3, height/2]);

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
                let genres = countries[getSynonym(d.properties.name)];
                let genreMax = "";
                let nbArtiste = 0;
                for(g in genres) {
                    if(genres[g] > nbArtiste ){
                        genreMax = g;
                        nbArtiste = genres[g];
                    }
                }
                if(genreMax === ""){
                    genreMax = "undefined";
                }
                return genreColor[genreMax];
            })
            .attr("id", d => getSynonym(d.properties.name).replace(" ",""))
            .style("stroke", "Black")
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            /*.on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )*/
    }

    // SLIDER

    var dataTime = d3.range(0, 104).map(function(d) {
        return new Date(1914 + d, 10, 3);
    });

    var sliderTime = d3
        .sliderLeft()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .height(1000)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(1998, 10, 3))
        .on('onchange', val => {
            countries = getArtistsByCountry(genresFiltered, artistes, d3.timeFormat('%Y')(val))
            console.log(countries)
            refillMap(countries);
            d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
        });

    var gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', 100)
        .attr('height', 1040)
        .append('g')
        .attr('transform', 'translate(60,30)');

    gTime.call(sliderTime);

    d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));


    return "Fin Choropleth";
}

function getSynonym(country){
    if(synonymsCountries[country]){
        return synonymsCountries[country];
    }else{
        return country;
    }
}

function refillMap(countries){
    d3.selectAll("path").attr("fill", genreColor["undefined"])

    for(let c in countries) {
        d3.select("#"+c.replace(" ",""))
        .attr("fill", function (d){
            let genresR = countries[getSynonym(c)];
            let genreMaxR = "";
            let nbArtiste = 0;
            for(g in genresR) {
                if(genresR[g] > nbArtiste ){
                    genreMaxR = g;
                    nbArtiste = genresR[g];
                }
            }
            if(genreMaxR === ""){
                genreMaxR = "undefined";
            }
            return genreColor[genreMaxR];
        })
    }

}