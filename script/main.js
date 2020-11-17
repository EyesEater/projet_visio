d3.json("public/wasabi-artist.json").then(async rawData => {
    let data = {};
    let genres = new Set();
    rawData.forEach(d => {
        if (d.genres !== "[]") {
            data[d.id_artist_deezer] = {"id": d.id_artist_deezer, "name": d.name, "type": d.type, "lifeSpan": d.lifeSpan, "gender": d.gender, "genres": d.genres, "deezerFans": d.deezerFans, "location": d.location};
            let str = d.genres.substr(1, d.genres.length-2);
            str = str.replace(/[^A-Za-z,\s]/g, "").split(",");
            str.forEach(s => {
                genres.add(s);
            });
        }
    });
    console.log(genres);

    await choropleth();
    await pyramid();
    await treemap();
});