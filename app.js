const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')
const loader = document.getElementById('loader')
const carregando = document.querySelector('.carregando')


const apiURL = `https://api.lyrics.ovh`

const fetchData = async url => {
    const response = await fetch(url)
    return await response.json()
}

const getMoreSongs = async url => {
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)
    insertSongsIntoPage(data)
}

const insertNextAndPrevButtons = ({ prev, next }) => {
    loader.innerHTML = ""
    prevAndNextContainer.innerHTML = `
     ${prev ? `<button class="btn" onClick="getMoreSongs('${prev}')">Anteriores</button>` : ''}
     ${next ? `<button class="btn" onClick="getMoreSongs('${next}')">Próximas</button>` : ''}
    `
}

const insertSongsIntoPage = ({ data, prev, next }) => {
    // join retorna uma nova string com todos os itens do array concatenados e separados por vírgula
    songsContainer.innerHTML = data.map(({ artist: { name }, title }) => `
    <li class="song">
    <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>
    </li>
    `).join('')

    if (prev || next) {
        insertNextAndPrevButtons({ prev, next })
        return
    }

    prevAndNextContainer.innerHTML = ''
}

const fetchSongs = async term => {
    const data = await fetchData(`${apiURL}/suggest/${term}`)
    insertSongsIntoPage(data)
}

const handleFormSubmit = event => {
    event.preventDefault()

    const searchTerm = searchInput.value.trim() // trim remove espaços em branco no começo e no fim da string
    searchInput.value = ''
    searchInput.focus()
    loader.innerHTML = `<div class="carregando"></div>`

    if (!searchTerm) {
        songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido</li>`
        loader.innerHTML = ""

        return
    }
    fetchSongs(searchTerm)

}

form.addEventListener('submit', handleFormSubmit)

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
    songsContainer.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
    `
}

const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`)
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    insertLyricsIntoPage({ lyrics, artist, songTitle })
}

const handleSongsContainerClick = event => {
    const clickedElement = event.target

    if (clickedElement.tagName === 'BUTTON') {
        const artist = clickedElement.getAttribute('data-artist')
        const songTitle = clickedElement.getAttribute('data-song-title')

        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist, songTitle)

    }
}
songsContainer.addEventListener('click', handleSongsContainerClick)

//loader.innerHTML = `<div class="carregando"></div>`