// API ID = urDTuLSKkdWYOBAUrn7q
// API KEY = Z5nFD05dGMVdYRl3mJz9lC1LaUPpbOsNmM7Mu8_wUic
// https://www.openstreetmap.org/#map=4/-15.13/-53.19
// https://leafletjs.com/




function renderMap() {
    var platform = new H.service.Platform({
        'apikey': 'Z5nFD05dGMVdYRl3mJz9lC1LaUPpbOsNmM7Mu8_wUic'
    })

    var defaultLayers = platform.createDefaultLayers()

    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: { lat: -22.2208, lng: -49.9486 }
        })

    window.addEventListener('resize', function () {
        map.getViewPort().resize()
    })

    console.log('Mapa renderizado')

    return map
}

function saveStorage() {
    fetch('./assets/json/rotas.json')
        .then(response => response.json())
        .then(data => {
            const cardsData = data.trajetos 
            sessionStorage.setItem('allCardData', JSON.stringify(cardsData))

            cardsData.forEach(cardData => createCard(cardData))
        })
        .catch(error => {
            console.error('Erro ao buscar o arquivo JSON:', error)
        })
}


function createCard(trajeto) { 
    const container = document.getElementById('container')

    let card = document.createElement('div')
    card.className = 'col-6'
    card.innerHTML = `
        <div class="index__route-card">
            <p class="index__card-origem"><span>Origem: </span>${trajeto.origem.nome_cidade}</p>
            <p class="index__card-destino"><span>Destino: </span>${trajeto.destino.nome_cidade}</p>
            <p class="index__card-horario"><span>Horario: </span>${trajeto.horario}</p>
            <p class="index__card-data"><span>Data: </span>${trajeto.data}</p>
            <p class="index__card-estabelecimento"><span>Local: </span>${trajeto.empresa}</p>
            <img class="index__route-card-bg" src="./assets/img/icon.png" alt="Ícone de logo Fulltime"> 
        </div>
    `
    container.appendChild(card)
}



const estadosSelect = document.querySelectorAll('.estado')
const cidadesSelectOrigem = document.querySelector('.cidade__origem')
const cidadesSelectDestino = document.querySelector('.cidade__destino')


async function carregarEstados() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        const estados = await response.json()
        
        estados.forEach(estado => {
            const option = document.createElement('option')
            option.value = estado.id
            option.textContent = estado.nome
            estadosSelect.forEach(select => {
                select.appendChild(option.cloneNode(true))
            })
        })
    } catch (error) {
        console.error('Erro ao carregar os estados:', error)
    }
}

async function carregarCidadesOrigem(selecionado) {
    const estadoSelecionado = selecionado.value
    if (estadoSelecionado) {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
        const cidades = await response.json()
        
        cidadesSelectOrigem.innerHTML = '<option value="">Selecione uma cidade</option>'

        cidades.forEach(cidade => {
            const option = document.createElement('option')
            option.value = cidade.nome
            option.textContent = cidade.nome
            cidadesSelectOrigem.appendChild(option)
        })
    } else {
        cidadesSelectOrigem.innerHTML = '<option value="">Selecione um estado primeiro</option>'
    }
}

async function carregarCidadesDestino(selecionado) {
    const estadoSelecionado = selecionado.value
    if (estadoSelecionado) {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
        const cidades = await response.json()
        
        cidadesSelectDestino.innerHTML = '<option value="">Selecione uma cidade</option>'

        cidades.forEach(cidade => {
            const option = document.createElement('option')
            option.value = cidade.nome
            option.textContent = cidade.nome
            cidadesSelectDestino.appendChild(option)
        })
    } else {
        cidadesSelectDestino.innerHTML = '<option value="">Selecione um estado primeiro</option>'
    }
}

function saveFormData() {
    const estado = document.querySelectorAll('.estado')
    const origem = document.querySelector('.cidade__origem').value
    const destino = document.querySelector('.cidade__destino').value
    const dataHora = document.querySelector('.form__input[type="datetime-local"]').value
    const local = document.querySelector('.form__input[type="text"]').value

    const partesDataHora = dataHora.split('T')
    const data = partesDataHora[0]
    const partesData = data.split('-')
    const dataFormatada = partesData[2] + '/' + partesData[1]

    const formData = {
        origem: {
            nome_cidade: origem
        },
        destino: {
            nome_cidade: destino
        },
        empresa: local,
        horario: partesDataHora[1],
        data: dataFormatada
    }

    let allCardData = JSON.parse(sessionStorage.getItem('allCardData')) || []

    allCardData.push(formData)

    sessionStorage.setItem('allCardData', JSON.stringify(allCardData))

    createCard(formData)

    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Os dados foram salvos com sucesso!',
    })

    estado.forEach(select => {
        select.value = ''
    })

    const modal = document.getElementById('exampleModal')
    const bootstrapModal = bootstrap.Modal.getInstance(modal)
    bootstrapModal.hide()

    document.querySelector('.cidade__origem').value = ''
    document.querySelector('.cidade__destino').value = ''
    document.querySelector('.form__input[type="datetime-local"]').value = ''
    document.querySelector('.form__input[type="text"]').value = ''
}






renderMap()
saveStorage()
carregarEstados()
