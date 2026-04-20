const audio = new Audio(null)

const playSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/play.svg"
const pauseSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/pause.svg"

let tracksArr = []

const select = (s, m = false) => m ? document.querySelectorAll(s) : document.querySelector(s)

const changeTrack = (track) => {
    // Везде ставим иконки play
    select('.play-btn > img', true).forEach(pic => pic.src = playSvg)
    const audioObj = tracksArr.find(t => t.title === track)
    const link = audioObj.audio_url
    const title = audioObj.title

    // Если до этого ничего не проигрывалось
    if (!audio.src) {
        audio.src = link
        audio.play()
    }
    // Если что-то уже проигрывалось
    else {
        // Поставить на паузу (снять с паузы), если 
        // ссылка на трек такая же, как и у текущего трека
        if (audio.src === link) {
            console.log(audio.paused)
            if (audio.paused) {
                audio.play()
                select('.music-item[data-music-title="' + title + '"] > .play-btn > img').src = pauseSvg
            }
            else {
                audio.pause()
                select('.music-item[data-music-title="' + title + '"] > .play-btn > img').src = playSvg
            }
        } else {
            audio.pause()
            audio.currentTime = 0
            audio.src = link
            audio.play()
        }
    }
    select('.music-item', true).forEach(musicItem => {
        if (musicItem.getAttribute("data-music-title") === track) {
            musicItem.querySelector('.play-btn > img').src = pauseSvg
        }
    })
}

const renderTracks = (tracks) => {
    tracksArr = tracks

    const songsCont = select('#songs')
    songsCont.innerHTML = ''
    tracks.forEach(track => {
        const audioEl = document.createElement('div')
        audioEl.classList = "music-item"
        audioEl.setAttribute('data-music-title', track.title)

        audioEl.innerHTML += `<button class="play-btn" onclick="changeTrack('${track.title}')">
            <img src="${playSvg}" />
        </button>`

        audioEl.innerHTML += `
        <div class="texts">
            <span class="music-title">${track.title}</span>
            <small class="music-author">${track.artist + (track.featured_artist !== null ? " & " + track.featured_artist : "")}</small>
        </div>
    `

        if (track.cover_url.includes('https')) {
            audioEl.innerHTML += `<div class="right-cont"><img src="${track.cover_url}" class="music-cover">`
        } else {
            audioEl.innerHTML += `<div class="right-cont">`
        }

        audioEl.innerHTML += `<a class="detail-link" href="/music/index.html?track=${track.slug}">More</a></div>`

        songsCont.appendChild(audioEl)
    })
}

document.addEventListener('DOMContentLoaded', function () {
    const allTracksUrl = atob('aHR0cHM6Ly95YW9taS1yYWJiaXQub215cmF1Y3kud29ya2Vycy5kZXYvYWxs')
    fetch(allTracksUrl).then(r => r.json()).then(data => {
        if (data.status === "success") { renderTracks(data.tracks) }
        else { throw new Error(data.message) }
    })

    audio.onended = () => {
        select('.play-btn > img', true).forEach(pic => pic.src = playSvg)
    }
})