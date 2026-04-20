const params = new URLSearchParams(document.location.search)
const track = params.get("track")

if (!track) {
    location.href = "/"
}

const renderTracks = (track) => {
    document.title = track.title
    console.log(track)
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://yaomi-rabbit.omyraucy.workers.dev/?track=' + track).then(r => r.json()).then(data => {
        if (data.status === "success") {
            renderTracks(data.track)
        }
    })
})