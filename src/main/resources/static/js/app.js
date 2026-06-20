const popSong = document.getElementById("pop_song");
const input = document.getElementById("searchInput");

// Cargar canciones al iniciar
fetch(`https://itunes.apple.com/search?term=Gera MX&entity=song&limit=20`)
    .then(res => res.json())
    .then(data => {
        mostrarCanciones(data.results);
    });

// Buscar mientras escribe
input.addEventListener("keyup", () => {

    const artista = input.value;

    console.log("Escribiendo:", artista);

    if(artista.trim() === ""){

        fetch(`https://itunes.apple.com/search?term=Gera MX&entity=song&limit=20`)
            .then(res => res.json())
            .then(data => {
                mostrarCanciones(data.results);
            });

        return;
    }

    fetch(`https://itunes.apple.com/search?term=${artista}&entity=song&limit=20`)
        .then(res => res.json())
        .then(data => {
            mostrarCanciones(data.results);
            mostrarBusqueda(data.results);
        });

});

function mostrarCanciones(canciones){

    listaCanciones = canciones;

    document.getElementById("totalCanciones").innerText =
        canciones.length;

    popSong.innerHTML = "";

    canciones.forEach(song => {

        popSong.innerHTML += `
        <div class="songItem"
             onclick="playSong(
                '${song.previewUrl}',
                '${song.artworkUrl100}',
                '${song.trackName.replace(/'/g,'')}',
                '${song.artistName.replace(/'/g,'')}'
             )">

            <img src="${song.artworkUrl100}" alt="${song.trackName}">

            <h5>
                ${song.trackName}

                <div class="subtitle">
                    ${song.artistName}
                </div>

                <div class="album">
                    ${song.collectionName}
                </div>
            </h5>

            <i class="bi bi-heart-fill"
   onclick='event.stopPropagation(); agregarFavorito(${JSON.stringify(song)})'>
</i>

        </div>
        `;
    });
}

const player = document.getElementById("audioPlayer");

let listaCanciones = [];
let cancionActual = 0;

const searchResults = document.getElementById("search_results");

function mostrarBusqueda(canciones){

    searchResults.innerHTML = "";

    canciones.forEach(song => {

        searchResults.innerHTML += `
        <a href="#" class="card">
            <img src="${song.artworkUrl100}">
            <div class="content">
                ${song.trackName}
                <div class="subtitle">
                    ${song.artistName}
                </div>
            </div>
        </a>
        `;

    });
}

const masterPlay =
    document.getElementById("masterPlay");

masterPlay.addEventListener("click", () => {

    if(player.paused){

        player.play();

        masterPlay.classList.remove("bi-play-fill");
        masterPlay.classList.add("bi-pause-fill");

        document.getElementById("wave")
            .classList.add("active2");

    } else {

        player.pause();

        masterPlay.classList.remove("bi-pause-fill");
        masterPlay.classList.add("bi-play-fill");

        document.getElementById("wave")
            .classList.remove("active2");

    }

});

next.addEventListener("click", () => {

    if(listaCanciones.length === 0) return;

    cancionActual++;

    if(cancionActual >= listaCanciones.length){
        cancionActual = 0;
    }

    const song = listaCanciones[cancionActual];

    playSong(
        song.previewUrl,
        song.artworkUrl100,
        song.trackName,
        song.artistName
    );

    back.addEventListener("click", () => {

        if(listaCanciones.length === 0) return;

        cancionActual--;

        if(cancionActual < 0){
            cancionActual = listaCanciones.length - 1;
        }

        const song = listaCanciones[cancionActual];

        playSong(
            song.previewUrl,
            song.artworkUrl100,
            song.trackName,
            song.artistName
        );
    });

    player.addEventListener("ended", () => {
        next.click();
    });
});
function playSong(url, image, title, artist){

    cancionActual = listaCanciones.findIndex(
        song => song.previewUrl === url
    );

    player.pause();
    player.src = url;

    player.play().catch(error => {
        console.log(error);
    });

    localStorage.setItem(
        "ultimaCancion",
        JSON.stringify({
            url,
            image,
            title,
            artist
        })
    );

    document.getElementById("wave")
        .classList.add("active2");

    masterPlay.classList.remove("bi-play-fill");
    masterPlay.classList.add("bi-pause-fill");

    document.getElementById("poster_master_play").src = image;


    document.getElementById("title").innerHTML = `
    ${title}
    <div class="subtitle">${artist}</div>
`;
}

function agregarFavorito(song){

    let favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    const existe = favoritos.some(
        fav => fav.trackId === song.trackId
    );

    if(existe){
        alert("⚠️ Ya está en favoritos");
        return;
    }

    favoritos.push(song);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    cargarFavoritos();

    document.getElementById("totalFavoritos").innerText =
        favoritos.length;

    alert("❤️ Agregado a favoritos");
}
function cargarFavoritos(){

    const favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    document.getElementById("totalFavoritos").innerText =
        favoritos.length;

    const contenedor =
        document.getElementById("favoritos");

    if(!contenedor) return;

    contenedor.innerHTML = "";

    favoritos.forEach(song => {

        contenedor.innerHTML += `
<div class="songItem"
     onclick="playSong(
        '${song.previewUrl}',
        '${song.artworkUrl100}',
        '${song.trackName.replace(/'/g,'')}',
        '${song.artistName.replace(/'/g,'')}'
     )">

    <img src="${song.artworkUrl100}">

    <h5>
        ${song.trackName}
        <div class="subtitle">
            ${song.artistName}
        </div>
    </h5>
</div>
`;
    });
}

function eliminarFavorito(trackId){

    let favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    favoritos = favoritos.filter(
        song => song.trackId !== trackId
    );

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    cargarFavoritos();
}

player.addEventListener("timeupdate", () => {

    if(player.duration){

        let progress =
            (player.currentTime / player.duration) * 100;

        document.getElementById("seek").value = progress;

        document.getElementById("bar2").style.width =
            progress + "%";

        document.querySelector(".bar .dot").style.left =
            progress + "%";
    }

});

player.addEventListener("loadedmetadata", () => {

    let total = Math.floor(player.duration);

    let min = Math.floor(total / 60);
    let sec = total % 60;

    if(sec < 10) sec = "0" + sec;

    document.getElementById("currentEnd").innerText =
        `${min}:${sec}`;

});

const vol = document.getElementById("vol");
const volBar = document.querySelector(".vol_bar");
const volDot = document.getElementById("vol_dot");

vol.addEventListener("input", () => {

    player.volume = vol.value / 100;

    volBar.style.width = vol.value + "%";

    volDot.style.left = vol.value + "%";

});

player.addEventListener("ended", () => {

    masterPlay.classList.remove("bi-pause-fill");
    masterPlay.classList.add("bi-play-fill");

    document.getElementById("wave")
        .classList.remove("active2");

});

const seek = document.getElementById("seek");

seek.addEventListener("input", () => {

    player.currentTime =
        (seek.value / 100) * player.duration;

});

const ultimaCancion =
    JSON.parse(localStorage.getItem("ultimaCancion"));

if(ultimaCancion){

    player.src = ultimaCancion.url;

    document.getElementById("poster_master_play").src =
        ultimaCancion.image;

    document.getElementById("title").innerHTML =
        `${ultimaCancion.title}
        <div class="subtitle">
            ${ultimaCancion.artist}
        </div>`;
}

cargarFavoritos();
