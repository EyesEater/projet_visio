d3.json("public/wasabi-artist.json").then(async rawData => {
    let data = {};
    let rawGenres = new Set();
    rawData.forEach(d => {
        if (d.genres !== "[]") {
            data[d.id_artist_deezer] = {"id": d.id_artist_deezer, "name": d.name, "type": d.type, "lifeSpan": d.lifeSpan, "gender": d.gender, "rawGenres": d.genres, "deezerFans": d.deezerFans, "location": d.location};
            let str = d.genres.substr(1, d.genres.length-2);
            str = str.replace(/[^A-Za-z,\s]/g, "").split(",");
            str.forEach(s => {
                rawGenres.add(s);
            });
        }
    });
    console.log(rawGenres);
    let genres = {};
    rawGenres.forEach(g => {
        let s = g.toLowerCase();
        let added = false;
        if (s.includes("rock") || s.includes("punk")) {
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
        if (s.includes("metal") || s.includes("death")) {
            if (!genres.metal) {
                genres.metal = [g];
            } else {
                genres.metal.push(g);
            }
            added = true;
        }
        if (s.includes("jazz")) {
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
        if (s.includes("electro") || s.includes("trance") || s.includes("techno") || s.includes("house") || s.includes("wave") || s.includes("ambient") || s.includes("dance")) {
            if (!genres.electro) {
                genres.electro = [g];
            } else {
                genres.electro.push(g);
            }
            added = true;
        }
        if (s.includes("reggae") || s.includes("ska")) {
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
        if (s.includes("country")) {
            if (!genres.country) {
                genres.country = [g];
            } else {
                genres.country.push(g);
            }
            added = true;
        }
        if (s.includes("latin")) {
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
        if (s.includes("classic")) {
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
    console.log(genres);

    await choropleth();
    await pyramid();
    await treemap();
});