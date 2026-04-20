const audio = new Audio(null)

const playSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/play.svg"
const pauseSvg = "https://pub-c6c043fab84f4b73a183f59fb6b061f0.r2.dev/yaomi-rabbit/pause.svg"

const select = (s, m = false) => m ? document.querySelectorAll(s) : document.querySelector(s)

const renderTracks = (tracks) => {
    const songsCont = select('#songs')
    songsCont.innerHTML = ''
    tracks.forEach(track => {
        const audioEl = document.createElement('div')
        audioEl.classList = "music-item"

        audioEl.innerHTML += `<button class="play-btn">
      <img src="${playSvg}" />
    </button>`

        audioEl.innerHTML += `
      <div class="texts">
        <span class="music-title">${track.title}</span>
        <small class="music-author">${track.artist + (track.featured_artist !== null ? " & " + track.featured_artist : "")}</small>
      </div>
    `

        audioEl.innerHTML += `<div class="right-cont">`

        if (track.cover_url.includes('https')) {
            audioEl.innerHTML += `<img src="${track.cover_url}" class="music-cover">`
        }

        audioEl.innerHTML += `<a class="detail-link" href="/music?track=${track.slug}">Подробно</a></div>`

        songsCont.appendChild(audioEl)
    })
}

document.addEventListener('DOMContentLoaded', function () {
    const allTracksUrl = atob('aHR0cHM6Ly95YW9taS1yYWJiaXQub215cmF1Y3kud29ya2Vycy5kZXYvYWxs')
    fetch(allTracksUrl).then(r => r.json()).then(data => {
        if (data.status === "success") { renderTracks(data.tracks) }
        else { throw new Error(data.message) }
    })
})