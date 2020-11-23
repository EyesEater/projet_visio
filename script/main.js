function getGenresFiltered(rawGenres) {
    let genres = {};
    rawGenres.forEach(g => {
        let s = g.toLowerCase();
        let added = false;
        if (s.includes("rock") || s.includes("punk") || s.includes("grunge")) {
            if (!genres.rock) {
                genres.rock = [g];
            } else {
                genres.rock.push(g);
            }
            added = true;
        }
        if (s.includes("pop") || s.includes("disco")) {
            if (!genres.pop) {
                genres.pop = [g];
            } else {
                genres.pop.push(g);
            }
            added = true;
        }
        if (s.includes(" hop") || s.includes("rap")) {
            if (!genres.hiphop) {
                genres.hiphop = [g];
            } else {
                genres.hiphop.push(g);
            }
            added = true;
        }
        if (s.includes("metal") || s.includes("death") || s.includes("grind") || s.includes("thrash")
            || s.includes("nwobhm") || s.includes("nsbm") || s.includes("drone")) {
            if (!genres.metal) {
                genres.metal = [g];
            } else {
                genres.metal.push(g);
            }
            added = true;
        }
        if (s.includes("jazz") || s.includes("bop") || s.includes("swing") || s.includes("boogie")) {
            if (!genres.jazz) {
                genres.jazz = [g];
            } else {
                genres.jazz.push(g);
            }
            added = true;
        }
        if (s.includes("folk")) {
            if (!genres.folk) {
                genres.folk = [g];
            } else {
                genres.folk.push(g);
            }
            added = true;
        }
        if (s.includes("electro") || s.includes("trance") || s.includes("techno") || s.includes("house")
            || s.includes("wave") || s.includes("ambient") || s.includes("dance") || s.includes("step")
            || s.includes("bass") || s.includes("edm") || s.includes("ebm") || s.includes("beat")
            || s.includes("rub") || s.includes("idm") || s.includes("rave") || s.includes("chill")
            || s.includes("tronic")) {
            if (!genres.electro) {
                genres.electro = [g];
            } else {
                genres.electro.push(g);
            }
            added = true;
        }
        if (s.includes("reggae") || s.includes("ska") || s.includes("ragga") || s === "dub") {
            if (!genres.reggae) {
                genres.reggae = [g];
            } else {
                genres.reggae.push(g);
            }
            added = true;
        }
        if (s.includes("blues")) {
            if (!genres.blues) {
                genres.blues = [g];
            } else {
                genres.blues.push(g);
            }
            added = true;
        }
        if (s.includes("funk")) {
            if (!genres.funk) {
                genres.funk = [g];
            } else {
                genres.funk.push(g);
            }
            added = true;
        }
        if (s.includes("country") || s.includes("bluegrass")) {
            if (!genres.country) {
                genres.country = [g];
            } else {
                genres.country.push(g);
            }
            added = true;
        }
        if (s.includes("latin") || s.includes("samba") || s.includes("bossa nova") || s.includes("flamenco")
            || s.includes("salsa") || s.includes("mexican")) {
            if (!genres.latin) {
                genres.latin = [g];
            } else {
                genres.latin.push(g);
            }
            added = true;
        }
        if (s.includes("soul") || s.includes("gospel")) {
            if (!genres.soul) {
                genres.soul = [g];
            } else {
                genres.soul.push(g);
            }
            added = true;
        }
        if (s.includes("classic") || s.includes("music") || s.includes("opera") || s.includes("orchestral")) {
            if (!genres.classic) {
                genres.classic = [g];
            } else {
                genres.classic.push(g);
            }
            added = true;
        }

        if (!added) {
            if (!genres.other) {
                genres.other = [g];
            } else {
                genres.other.push(g);
            }
        }
    });
    return genres;
}

function getGroups(artistes){
    let groups = new Set();
    for(a in artistes)
        if(artistes[a]["type"].toLowerCase() === "group"){
            groups.add(artistes[a]);
        }
    return groups;
}

d3.json("public/wasabi-artist.json").then(async rawData => {
    let artistes = {};
    let rawGenres = new Set();
    rawData.forEach(d => {
        if (d.genres !== "[]") {
            let genre = d.genres.substr(1, d.genres.length-2);
            genre = genre.replace(/[^A-Za-z,\s]/g, "").split(",");
            genre.forEach(s => {
                rawGenres.add(s);
            });
            artistes[d.id_artist_deezer] = {"id": d.id_artist_deezer, "name": d.name, "type": d.type,
                "lifeSpan": d.lifeSpan, "gender": d.gender, "genres": genre, "deezerFans": d.deezerFans,
                "location": d.location};
        }
    });

    let genres = getGenresFiltered(rawGenres);
    let groups = getGroups(artistes);
    /*
    choropleth().then(result => {
        console.log(result);
    });
    pyramid(groups).then(result => {
        console.log(result);
    });
     */
    treemap(artistes, genres).then(result => {
        console.log(result);
    });
});