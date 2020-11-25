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
        if (s.includes("pop") || s.includes("disco") || s.includes("singersongwriter") || s.includes("chanson")) {
            if (!genres.popMusic) {
                genres.popMusic = [g];
            } else {
                genres.popMusic.push(g);
            }
            added = true;
        }
        if (s.includes(" hop") || s.includes("rap") || s.includes("rub")) {
            if (!genres.hiphop) {
                genres.hiphop = [g];
            } else {
                genres.hiphop.push(g);
            }
            added = true;
        }
        if (s.includes("metal") || s.includes("death") || s.includes("grind") || s.includes("thrash")
            || s.includes("nwobhm") || s.includes("nsbm") || s.includes("drone") || s.includes("industrial") || s.includes("hardcore")) {
            if (!genres.metal) {
                genres.metal = [g];
            } else {
                genres.metal.push(g);
            }
            added = true;
        }
        if (s.includes("jazz") || s.includes("bop") || s.includes("swing") || s.includes("boogie") || s.includes("big band")) {
            if (!genres.jazz) {
                genres.jazz = [g];
            } else {
                genres.jazz.push(g);
            }
            added = true;
        }
        if (s.includes("folk") || s.includes("acoustic")) {
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
            || s.includes("idm") || s.includes("rave") || s.includes("chill")
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
            || s.includes("salsa") || s.includes("mexican") || s.includes("brazilian") || s.includes("mpb") || s.includes("sertanejo")) {
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
        if (s.includes("classic") || s.includes("music") || s.includes("opera") || s.includes("orchestral") || s.includes("baroque") || s.includes("bolero")) {
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

function getMainGenre(genresFiltered, genre){
    let mainGenres = [];

    for(let g in genresFiltered) {
        if(genresFiltered[g].includes(genre)){
            mainGenres.push(g);
        }
    }
    //mainGenres = mainGenres.filter(item => item !== "other")
    return mainGenres;
}

function getArtistsByCountry(genresFiltered, artistes, year){
    let countries = {};
    for (let a in artistes) {
        let yearBegin = artistes[a].lifeSpan.begin.split("-")[0];
        let yearEnd = artistes[a].lifeSpan.end.split("-")[0];

        if((yearEnd === "" || yearEnd >= year) && yearBegin <= year && countryList.includes(artistes[a].location.country)) {
            if (!countries[artistes[a].location.country] ) {
                countries[artistes[a].location.country] = {};
            }
            artistes[a].genres.forEach(g => {
                getMainGenre(genresFiltered, g).forEach(mg => {
                    if(!countries[artistes[a].location.country][mg]){
                        countries[artistes[a].location.country][mg] = 0;
                    }
                    countries[artistes[a].location.country][mg] = parseInt(countries[artistes[a].location.country][mg]) + 1;
                });
            });
        }
    }

    for (c in countries){
        if(Object.keys(countries[c]).length > 1){
            //countries[c] = countries[c].remove("other")
            delete countries[c]["other"];
        }
    }
    return countries;
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
    let countries = getArtistsByCountry(genres, artistes, "1998");

    choropleth(genres, artistes, countries).then(result => {
        console.log(result);
    });
    // pyramid(groups).then(result => {
    //     console.log(result);
    // });

    /*treemap(artistes, genres).then(result => {
        console.log(result);
    });*/
});