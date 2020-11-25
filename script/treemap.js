function getDataFormated(artistes, genres) {
    let data = {
        "name":"genres",
        "color":"#FFF",
        "children": []
    };

    for (let elem in genres) {
        let children = [];
        var colorFamily = d3.scaleLinear().domain([1,7]).range([genreColor[elem], "#FFF"])
        if (genres.hasOwnProperty(elem)) {
            for (let value in genres[elem]) {
                if (genres[elem].hasOwnProperty(value)) {
                    let tmpArtiste = [];
                    for (let id in artistes) {
                        if (artistes.hasOwnProperty(id)) {
                            if (artistes[id].genres.includes(genres[elem][value])) {
                                let artiste = artistes[id];
                                artiste.value = artistes[id].deezerFans;
                                artiste.color = colorFamily(5);
                                tmpArtiste.push(artiste);
                            }
                        }
                    }

                    children.push({
                        "name": genres[elem][value],
                        "color": colorFamily(3),
                        "children": tmpArtiste
                    });
                }
            }

            data["children"].push({
                "name": elem,
                "color": colorFamily(1),
                "children": children
            });
        }
    }
    return data;
}

async function treemap(artistes, genres) {
    let data = getDataFormated(artistes, genres);

    const width = window.innerWidth;
    const height = window.innerHeight * 0.8;

    const animationSpeed = 500;

    let color = d3.scaleSequential([8, 0], d3.interpolateCool);

    const treemap = data => d3.treemap()
        .size([width, height])
        .paddingOuter(5)
        .paddingTop(20)
        .paddingInner(1)
        .round(true)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    }

    const zoom = (data) => {
        let name = data.data.name;
        let color = data.data.color;
        if (name && data.data.children) {
            render({
                name,
                color,
                children: data.data.children
            });
        }
    }

    function displayLeaf(data) {
        let person = data.data;
        renderLeaf(person);
    }

    const renderLeaf = data => {
        const root = treemap(data);

        const svg    = d3.select('.treemap');
        const newSvg = d3.select('.temp')
            .attr('viewBox', [0, 0, width, height]);

        // Create shadow
        newSvg.append('filter')
            .attr('id', 'shadow')
            .append('feDropShadow')
            .attr('flood-opacity', 0.5)
            .attr('dx', 0)
            .attr('dy', 0)
            .attr('stdDeviation', 2);

        // Create node
        const node = newSvg.selectAll('g')
            .data(d3.group(root, d => d.height))
            .join('g')
            .attr('filter', 'url(#shadow)')
            .selectAll('g')
            .data(d => d[1])
            .join('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        // Create title
        node.append('title')
            .text(d => {
                return d.name;
            });

        // Create rectangle
        node.append('rect')
            .attr('id', d => d.nodeId = uuidv4())
            .attr('fill', d => d.data.color)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0);

        // Create clip path for text
        node.append('clipPath')
            .attr('id', d => d.clipId = uuidv4())
            .append('use')
            .attr('href', d => `#${d.nodeId}`);

        // Create labels
        node.append('text')
            .attr('clip-path', d => `url(#${d.clipId})`)
            .selectAll('tspan')
            .data(d => [
                d.data.name,
                d.data.gender ? ( (d.data.gender === "Female") ? "Femme" : "Homme" ) : "Groupe",
                d.data.genres,
                (d.data.type === "Group") ? "Date de création du groupe " + d.data.lifeSpan.begin : "Date de naissance " + d.data.lifeSpan.begin,
                (d.data.type === "Group") ? ( (d.data.lifeSpan.end) ? "Date de fin du groupe " + d.data.lifeSpan.end : "Le groupe existe toujours"): ((d.data.lifeSpan.end) ? "Dates de décès " + d.data.lifeSpan.end : "L'artiste n'est pas décédé"),
                d.data.location.city + ", " + d.data.location.country,
                "Nombre de fans deezer " + d.data.deezerFans
            ])
            .join('tspan')
            .attr('x', 3)
            .attr('y', (d, i, nodes) => (i + 1) * 20)
            .text(d => d);

        // Fade out old svg
        svg.transition()
            // .ease(d3.easeCubicIn)
            .duration(animationSpeed)
            .attrTween('opacity', () => d3.interpolate(1, 0))

        // Fade in new svg
        newSvg.transition()
            // .ease(d3.easeCubicOut)
            .duration(animationSpeed)
            .attrTween('opacity', () => d3.interpolate(0, 1))
            .attr('class', 'treemap')
            .on('end', () => {
                // At the very end, swap classes and remove everything from the temporary svg
                svg.attr('class', 'temp').selectAll('*').remove();
            });

        d3.select('select').on('change', function () {
            color = d3.scaleSequential([8, 0], d3[d3.select(this).property('value')]);

            node.select('rect').attr('fill', d => d.data.color);
        });
    };

    const render = data => {
        const root = treemap(data);
        var popup = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", '#BBB');

        const svg    = d3.select('.treemap');
        const newSvg = d3.select('.temp')
            .attr('viewBox', [0, 0, width, height]);

        // Create shadow
        newSvg.append('filter')
            .attr('id', 'shadow')
            .append('feDropShadow')
            .attr('flood-opacity', 0.5)
            .attr('dx', 0)
            .attr('dy', 0)
            .attr('stdDeviation', 2);

        // Create node
        const node = newSvg.selectAll('g')
            .data(d3.group(root, d => d.height))
            .join('g')
            .attr('filter', 'url(#shadow)')
            .selectAll('g')
            .data(d => d[1])
            .join('g')
            .attr('transform', d => `translate(${d.x0},${d.y0})`);

        // Create title
        node.append('title')
            .text(d => {
                return d.name;
            });

        // Create rectangle
        node.append('rect')
            .attr('id', d => d.nodeId = uuidv4())
            .attr('fill', d => d.data.color)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0);

        // Create clip path for text
        node.append('clipPath')
            .attr('id', d => d.clipId = uuidv4())
            .append('use')
            .attr('href', d => `#${d.nodeId}`);

        // Create labels
        node.append('text')
            .attr('clip-path', d => `url(#${d.clipId})`)
            .selectAll('tspan')
            .data(d => [d.data.name, d.value])
            .join('tspan')
            .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.75 : null)
            .text(d => d);

        // Set position for parents
        node.filter(d => d.children)
            .selectAll('tspan')
            .attr('dx', 5)
            .attr('y', 15);

        // Set position for everything else that doesn't have children
        node.filter(d => !d.children)
            .selectAll('tspan')
            .attr('x', 3)
            .attr('y', (d, i, nodes) => i === nodes.length - 1 ? 30 : 15)

        // Add click event
        node.filter(d => d.children && d !== root)
            .attr('cursor', 'pointer')
            .on('click', (e,d) => zoom(d));

        // Add click event on leaf
        node.filter(d => !d.children)
            .attr('cursor', 'pointer')
            .on("mouseover", function (event,i){
                popup.transition()
                    .duration(200)
                    .style("opacity", .9);
                popup.html("<b>" + i.data.name + "</b><br/>" +
                    (i.data.gender ? ( (i.data.gender === "Female") ? "Femme" : "Homme" ) : "Groupe") + "<br/>" +
                    i.data.genres + "<br/>" +
                    ((i.data.type === "Group") ? "Date de création du groupe " + i.data.lifeSpan.begin : "Date de naissance ") + i.data.lifeSpan.begin + "<br/>" +
                    ((i.data.type === "Group") ? ( (i.data.lifeSpan.end) ? "Date de fin du groupe " + i.data.lifeSpan.end : "Le groupe existe toujours"): ((i.data.lifeSpan.end) ? "Dates de décès " + i.data.lifeSpan.end : "L'artiste n'est pas décédé")) + "<br/>" +
                    i.data.location.city + ", " + i.data.location.country + "<br/>" +
                    "Nombre de fans deezer " + i.data.deezerFans + "<br/>")
                    .style("left", ((event.x + 20) + "px"))
                    .style("top", ((event.y + 20) + "px"));
            })
            .on("mouseout", function() {
                popup.transition()
                    .duration(500)
                    .style("opacity", 0);
                popup.html("")
                    .style("left", ("0 px"))
                    .style("top", ("0 px"));
            })
            //.on('click', (e,d) => displayLeaf(d))

        // Fade out old svg
        svg.transition()
            // .ease(d3.easeCubicIn)
            .duration(animationSpeed)
            .attrTween('opacity', () => d3.interpolate(1, 0))

        // Fade in new svg
        newSvg.transition()
            // .ease(d3.easeCubicOut)
            .duration(animationSpeed)
            .attrTween('opacity', () => d3.interpolate(0, 1))
            .attr('class', 'treemap')
            .on('end', () => {
                // At the very end, swap classes and remove everything from the temporary svg
                svg.attr('class', 'temp').selectAll('*').remove();
            });

        d3.select('select').on('change', function () {
            //color = d3.scaleSequential([8, 0], d3[d3.select(this).property('value')]);
            let colorFamily = d3.scaleLinear().domain([1,3]).range([d3.select(this).property('value'), "#FFF"])
            node.select('rect').attr('fill', d => colorFamily(2));
        });
    };

    await (async () => {

        render(data);

        d3.select('button').on('click', () => render(data));
    })();

    return "Fin Treemap";
}