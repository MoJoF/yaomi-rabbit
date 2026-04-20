const select = (s, m = false) => m ? document.querySelectorAll(s) : document.querySelector(s)

const playSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/play.svg"
const pauseSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/pause.svg"

const params = new URLSearchParams(document.location.search)
const track = params.get("track")

if (!track) {
    location.href = "/"
}

const audio = new Audio(null)

const renderTracks = (track) => {
    document.title = track.title
    
    if (track.cover_url.includes('https')) { 
        const img = select('.song-cover')
        img.style.display = "block"
        img.src = track.cover_url
    }

    audio.src = track.audio_url

    const range = select('input[type=range]')
    
    audio.onloadedmetadata = () => { 
        range.min = "0"
        range.max = audio.duration
        range.value = "0"
    }

    audio.ontimeupdate = () => {
        const currentTime = audio.currentTime
        range.value = currentTime.toFixed(2)
    }

    audio.onended = () => {
        range.value = "0"
        select('button.play-btn > img').src = playSvg
    }

    range.onchange = (e) => {
        audio.currentTime = e.target.value
    }

    select('.music-title').textContent = track.title
    select('.music-author').textContent = track.artist + (track.featured_artist ? " & " + track.featured_artist : "")

    select('p.text').textContent = track.description

    const playBtn = select('button.play-btn')
    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play()
            playBtn.querySelector('img').src = pauseSvg
        } else {
            audio.pause()
            playBtn.querySelector('img').src = playSvg
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    fetch('https://yaomi-rabbit.omyraucy.workers.dev/?track=' + track).then(r => r.json()).then(data => {
        if (data.status === "success") {
            renderTracks(data.track)
        }
    })
})