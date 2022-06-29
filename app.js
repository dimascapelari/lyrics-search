const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const getMoreSongs = async url => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await response.json()
    console.log(data)
    insertSongsIntoPage(data)
}

const insertSongsIntoPage = songsInfo => {
    // join retorna uma nova string com todos os itens do array concatenados e separados por vírgula
    songsContainer.innerHTML = songsInfo.data.map(song => `
    <li class="song">
    <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>
    `).join('')

    if (songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songsInfo.prev}')">Anteriores</button>` : ''}
        ${songsInfo.next ? `<button class="btn" onClick="getMoreSongs('${songsInfo.next}')">Próximas</button>` : ''}
        `
        return
    }

    prevAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
    const response = await fetch(`${apiURL}/suggest/${term}`)
    const data = await response.json()

    insertSongsIntoPage(data)
}

form.addEventListener('submit', event => {
    event.preventDefault()

    const searchTerm = searchInput.value.trim() // trim remove espaços em branco no começo e no fim da string

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
        return
    }

    fetchSongs(searchTerm)
})

const fetchLyrics = async (artist, songTitle) => {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    const data = await response.json()

    console.log(data)
}

songsContainer.addEventListener('click', event => {
    const clickedElement = event.target

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        fetchLyrics(artist, songTitle)
    }
})