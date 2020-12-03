function findArtist(data,id){
    let artist = null;
    data.forEach(d => {
        if(d.id === id){
            artist = d;
        }
    });
    return artist;
}

function pyramidBuilder(data, index, target,genresFiltered, options) {
    var w = typeof options.width === 'undefined' ? 400  : options.width,
        h = typeof options.height === 'undefined' ? 400  : options.height,
        w_full = w,
        h_full = h;

    if (w > $( window ).width()) {
        w = $( window ).width();
    }

    var margin = {
            top: 50,
            right: 10,
            bottom: 20,
            left: 10,
            middle: 20
        },
        sectorWidth = (w / 2) - margin.middle,
        leftBegin = sectorWidth - margin.left,
        rightBegin = w - margin.right - sectorWidth;

    w = (w- (margin.left + margin.right) );
    h = (h - (margin.top + margin.bottom));

    if (typeof options.style === 'undefined') {
        var style = {
            leftBarColor: '#6c9dc6',
            rightBarColor: '#de5454',
            tooltipBG: '#fefefe',
            tooltipColor: 'black'
        };
    } else {
        var style = {
            leftBarColor: typeof options.style.leftBarColor === 'undefined'  ? '#6c9dc6' : options.style.leftBarColor,
            rightBarColor: typeof options.style.rightBarColor === 'undefined' ? '#de5454' : options.style.rightBarColor,
            tooltipBG: typeof options.style.tooltipBG === 'undefined' ? '#fefefe' : options.style.tooltipBG,
            tooltipColor: typeof options.style.tooltipColor === 'undefined' ? 'black' : options.style.tooltipColor
        };
    }

    d3.select(target).append('style')
        .text('svg {max-width:100%} \
    .axis line,axis path {shape-rendering: crispEdges;fill: transparent;stroke: #555;} \
    .axis text {font-size: 11px;} \
    .bar {fill-opacity: 0.5;} \
    .bar.left {fill: ' + style.leftBarColor + ';} \
    .bar.right {fill: ' + style.rightBarColor + ';} \
    .tooltip {position: absolute;line-height: 1.1em;padding: 7px; margin: 3px;background: ' + style.tooltipBG + '; color: ' + style.tooltipColor + '; pointer-events: none;border-radius: 6px;}')

    var region = d3.select(target).append('svg')
        .attr('width', w_full)
        .attr('height', h_full);


    var legend = region.append('g')
        .attr('class', 'legend');

    legend.append('text')
        .attr('fill', '#000')
        .attr('x', (w / 2) - (margin.middle * 4))
        .attr('y', 18)
        .attr('dy', '0.32em')
        .text('⭠ Created');

    legend.append('text')
        .attr('fill', '#000')
        .attr('x', (w / 2) + (margin.middle * 2))
        .attr('y', 18)
        .attr('dy', '0.32em')
        .text('Ended ⭢');

    // LEGEND
    d3.select("#legendPyramid")
        .append("svg").attr("id", "legendSVGP")
        .attr('width', 100)
        .attr('height', 500);

    var legend = d3.select("#legendSVGP")
        .append('g')
        .attr('class', 'legend');

    let cpt = 1;
    for (c in genreColor) {
        var ligne = legend.append("g").attr('transform', 'translate(0,'+cpt*30+')')
        ligne.append('rect')
            .attr('class', c)
            .attr('fill', genreColor[c])
            .attr('width', 12)
            .attr('height', 12);

        ligne.append('text')
            .attr('fill', "#000")
            .attr('dy', '0.32em')
            .attr("transform", 'translate(20,0)')
            .text(c);
        cpt++;
    }

    var popup = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("background-color", '#BBB');

    var pyramid = region.append('g')
        .attr('class', 'inner-region')
        .attr('transform', translation(margin.left, margin.top));


    var maxValue = Math.ceil(Math.max(
        d3.max(index, function(d) {
            return (d.created.length);
        }),
        d3.max(index, function(d) {
            return (d.ended.length);
        })
    ));

    // SET UP SCALES
    var xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, (sectorWidth-margin.middle)])
        .nice();

    var xScaleLeft = d3.scaleLinear()
        .domain([0, maxValue])
        .range([sectorWidth, 0]);

    var xScaleRight = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, sectorWidth]);

    let yearScale = [];
    for(let y=parseInt(options["maxYear"])+1;y>=parseInt(options["minYear"]);y--)
        yearScale.push(y);
    var yScale = d3.scaleBand()
        .domain(yearScale)
        .range([h, 0], 0.1);


    // SET UP AXES
    var yAxisLeft = d3.axisRight()
        .scale(yScale)
        .tickSize(4, 0)
        .tickPadding(margin.middle - 4);

    var yAxisRight = d3.axisLeft()
        .scale(yScale)
        .tickSize(4, 0)
        .tickFormat('');

    var xAxisRight = d3.axisBottom()
        .scale(xScale);

    var xAxisLeft = d3.axisBottom()
        .scale(xScale.copy().range([leftBegin, 0]));

    // MAKE GROUPS FOR EACH SIDE OF CHART
    var leftBarGroup = pyramid.append('g')
        .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)');
    var rightBarGroup = pyramid.append('g')
        .attr('transform', translation(rightBegin, 0));

    //CREATE BARS
    index.forEach(year => {
        leftBarGroup.append('g')
            .attr('x',0)
            .attr('y', yScale(year.year) + margin.middle / 4)
            .attr('class', 'bar left')
            .attr('id','barLeft'+year.year);

        let left = 0;
        year.created.forEach(c => {
            let artist = findArtist(data,c.id);
            leftBarGroup.select('#barLeft'+year.year)
                .append('rect')
                .attr('id','c'+c.id)
                .attr('x', xScale(left))
                .attr('y', function(d) {
                    return yScale(year.year) + margin.middle / 4;
                })
                .attr('width', function(d) {
                    return xScale(1);
                })
                .attr('height', yScale.range()[0]/yearScale.length)
                .attr('fill', function(d){
                    if(artist.lifeSpan.end === "")
                        return colorTransform(genreColor[c.genre],'111111');
                    else
                        return genreColor[c.genre];
                })
                .on("mouseover", function(d, i) {
                    d3.select(this).style("stroke", "black");
                    d3.select("#e"+c.id).style("stroke", "black");

                    popup.transition()
                        .duration(200)
                        .style("opacity", .9);
                    popup.html("<b>" + artist.name + "</b><br/>" + artist.genres[0] + "<br/>" + artist.lifeSpan.begin + "-" + artist.lifeSpan.end)
                        .style("left", (xScaleLeft.range()[0] - d3.select(this).attr("x") - margin.middle) + "px")
                        .style("right", null)
                        .style("top", (d3.select(this).attr("y")) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).style("stroke", "none");
                    d3.select("#e"+c.id).style("stroke", "none");
                    popup.transition()
                        .duration(500)
                        .style("opacity", 0);
            });
            left=left+1;
        });

        rightBarGroup.append('g')
            .attr('x',0)
            .attr('y', yScale(year.year) + margin.middle / 4)
            .attr('class', 'bar right')
            .attr('id','barRight'+year.year);

        let right = 0;
        year.ended.forEach(c => {
            let artist = findArtist(data,c.id);
            rightBarGroup.select('#barRight'+year.year)
                .append('rect')
                .attr('id','e'+c.id)
                .attr('x', xScale(right))
                .attr('y', function(d) {
                    return yScale(year.year) + margin.middle / 4;
                })
                .attr('width', function(d) {
                    return xScale(1);
                })
                .attr('height', yScale.range()[0]/yearScale.length)
                .attr('fill', function(d){
                    return genreColor[c.genre];
                })
                .on("mouseover", function(d, i) {
                    d3.select(this).style("stroke", "black");
                    d3.select("#c"+c.id).style("stroke", "black");

                    popup.transition()
                        .duration(200)
                        .style("opacity", .9);
                    popup.html("<b>" + artist.name + "</b><br/>" + artist.genres[0] + "<br/>" + artist.lifeSpan.begin + "-" + artist.lifeSpan.end)
                        .style("left", null)
                        .style("left", (parseInt(xScaleRight.range()[1]) + parseInt(d3.select(this).attr("x")) + margin.middle) + "px")
                        .style("top", (d3.select(this).attr("y")) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).style("stroke", "none");
                    d3.select("#c"+c.id).style("stroke", "none");
                    popup.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            right=right+1;
        });
    });

    // DRAW AXES
    pyramid.append('g')
        .attr('class', 'axis y left')
        .attr('transform', translation(leftBegin, 0))
        .call(yAxisLeft)
        .selectAll('text')
        .style('text-anchor', 'middle');

    pyramid.append('g')
        .attr('class', 'axis y right')
        .attr('transform', translation(rightBegin, 0))
        .call(yAxisRight);

    pyramid.append('g')
        .attr('class', 'axis x left')
        .attr('transform', translation(0, h))
        .call(xAxisLeft);

    pyramid.append('g')
        .attr('class', 'axis x right')
        .attr('transform', translation(rightBegin, h))
        .call(xAxisRight);

    // string concat for translate
    function translation(x, y) {
        return 'translate(' + x + ',' + y + ')';
    }

    // lighten colors
    function colorTransform(c1, c2) {
        var c1 = c1.replace('#','')
        origHex = {
            r: c1.substring(0, 2),
            g: c1.substring(2, 4),
            b: c1.substring(4, 6)
        },
            transVec = {
                r: c2.substring(0, 2),
                g: c2.substring(2, 4),
                b: c2.substring(4, 6)
            },
            newHex = {};

        function transform(d, e) {
            var f = parseInt(d, 16) + parseInt(e, 16);
            if (f > 255) {
                f = 255;
            }
            return f.toString(16);
        }
        newHex.r = transform(origHex.r, transVec.r);
        newHex.g = transform(origHex.g, transVec.g);
        newHex.b = transform(origHex.b, transVec.b);
        return '#' + newHex.r + newHex.g + newHex.b;
    }

}

function getYearObject(index,year){
    for(i in index){
        if(index[i].year === year)
            return index[i];
    }
    return null;
}

//LAUNCHES THE PYRAMID PROCESS
async function pyramid(groups,genresFiltered) {
    let index = [];
    let yearMin = 2020;
    let yearMax = 0;
    groups.forEach(g => {
        let yearBegin = g.lifeSpan.begin.split("-")[0];
        let yearEnd = g.lifeSpan.end.split("-")[0];
        g.lifeSpan.begin = yearBegin;
        g.lifeSpan.end = yearEnd;
        if(yearBegin !== "") {
            if (!getYearObject(index,yearBegin))
                index.push({year: yearBegin, created: [], ended: []});
            getYearObject(index,yearBegin)["created"].push({"id":g.id,"genre":getMainGenre(genresFiltered,g.genres[0])[0]});

            if(yearBegin < yearMin)
                yearMin = yearBegin;
            if(yearBegin > yearMax)
                yearMax = yearBegin;
        }

        if(yearEnd !== ""){
            if (!getYearObject(index,yearEnd))
                index.push({year: yearEnd, created: [], ended: []});
            getYearObject(index,yearEnd)["ended"].push({"id":g.id,"genre":getMainGenre(genresFiltered,g.genres[0])[0]});

            if(yearEnd < yearMin)
                yearMin = yearEnd;
            if(yearEnd > yearMax)
                yearMax = yearEnd;
        }
    });
    index = index.sort((a,b) => a.year - b.year);
    index.forEach(y =>{
        y.created = y.created.sort((a,b) => a.genre.localeCompare(b.genre));
        y.ended = y.ended.sort((a,b) => a.genre.localeCompare(b.genre));
    });

    var options = {
        minYear: yearMin,
        maxYear: yearMax,
        height: 1000,
        width: 2400
    }
    pyramidBuilder(groups, index, '#pyramid',genresFiltered,options);
    return "Fin pyramid";
}