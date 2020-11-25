function buildPieChart(data,countryName) {
    var width = 450,
    height = 450,
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
    d3.select("#piechart").select("svg").remove();
    var svg = d3.select("#piechart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.select("p#piechartlegend").text(countryName);

// Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null)
        .value(function(d) {return d[1]; })

    var data_ready;
    if(data !== undefined)
        data_ready = pie(Object.entries(data))
    else
        data_ready = pie([['undefined',1]])
    console.log(data_ready)
// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('piechart')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(genreColor[d.data[0]]) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        .append('text')
        .text(function (d){return d.data[0];})
}

async function choropleth(genresFiltered, artistes, countries) {
    // The svg
    var svg = d3.select("#choropleth")
            .append("svg")
            .attr("width", window.innerWidth*0.90).attr("height", window.innerHeight - 20),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(window.innerWidth/10)
        .center([0, 40])
        .translate([width/3, height/2]);

    // Load external data and boot
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(async rawData => {
        ready(null, rawData)});

    function ready(error, topo) {
        let mouseOver = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
            d3.select(this).style("cursor", "pointer");
        }

        let mouseLeave = function(d) {
            d3.selectAll(".Country")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                .transition()
                .duration(200)
            d3.select(this).style("cursor", "default");
        }

        let mouseClick = function (d) {
            buildPieChart(countries[getSynonym(d.target.id)],getSynonym(d.target.id));
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
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .on("click", mouseClick)
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

    // LEGEND
    d3.select("#legend")
        .append("svg").attr("id", "legendSVG")
        .attr('width', 100)
        .attr('height', 500);

    var legend = d3.select("#legendSVG")
        .append('g')
        .attr('class', 'legend');

    let cpt = 1;
    for (c in genreColor) {
        var ligne = legend.append("g").attr('transform', 'translate(0,'+cpt*30+')')
        ligne.append('rect')
            .attr('class', c)
            .attr('fill', genreColor[c])
            //.attr('x', (w / 2) - (margin.middle * 3))
            //.attr('y', 12)
            .attr('width', 12)
            .attr('height', 12);

        ligne.append('text')
            .attr('fill', "#000")
            //.attr('x', (w / 2) - (margin.middle * 2))
            //.attr('y', 18)
            .attr('dy', '0.32em')
            .attr("transform", 'translate(20,0)')
            .text(c);
        cpt++;
    }


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
    d3.select("#piechart").select("svg").remove();
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