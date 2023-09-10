
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('pokemonModal');
const closeModalBtn = document.querySelector('.close');

maxRecords = 21
const limit = 8
let offset = 0;
const pokemonDetails = {}
let clickedPokemon = null; // Declare a variável clickedPokemon aqui

function convertPokemonToLi(pokemon){
    return `
    <li class="pokemon ${pokemon.type} id=${pokemon.number}" data-id="${pokemon.number}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>

            <img src="${pokemon.photo}" alt="${pokemon.name}" class="pokemon-photo">
        </div>
                
    </li>
    `
}

function loadPokemonItens(offset, limit) {
    PokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
            pokemonList.innerHTML += newHtml
        }); 
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if(qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset

        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

    // Função para abrir o modal com os detalhes do Pokémon
function openPokemonModal(pokemon) {
    const modalContent = modal.querySelector('.modal-content');
    debugger
    // Preencha o conteúdo do modal com os detalhes do Pokémon
    modalContent.innerHTML = `
        <h2>${pokemon.name}</h2>
        <p>Number: ${pokemon.number}</p>
        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
        <img src="${pokemon.photo}" alt="${pokemon.name}" class="pokemon-photo">
        <!-- Adicione mais informações do Pokémon aqui -->
        <span class="close">&times;</span>
    `;

    // Defina o gradiente como plano de fundo
     modalContent.style.background = 'linear-gradient(90deg, white 500px, rgba(0, 0, 0, 0.7) 500px)';

  // Centralize o conteúdo vertical e horizontalmente
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.alignItems = 'center';
  modalContent.style.justifyContent = 'center';

    // Adicione a classe "clicked" apenas ao Pokémon com o modal aberto
    if (clickedPokemon) {
        clickedPokemon.classList.add('clicked');
    }

    // Abra o modal
    modal.style.display = 'block';
}

// ...

// Evento de clique em um Pokémon na lista
pokemonList.addEventListener('click', (event) => {
    const clickedPokemon = event.target.closest('.pokemon');
    if (clickedPokemon) {
        // Obtenha o ID único do Pokémon a partir do atributo data-id
        const pokemonId = clickedPokemon.getAttribute('data-id');

       // Verifique se pokemonId é válido antes de fazer a solicitação
        if (pokemonId !== null) {
            // Faça uma solicitação para obter os detalhes do Pokémon com o ID
            getPokemonDetails(pokemonId)
                .then((details) => {
                    // Preencha o objeto pokemonDetails com os detalhes
                    Object.assign(pokemonDetails, details);

                    // Abra o modal com os detalhes do Pokémon clicado
                    openPokemonModal(pokemonDetails);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error('ID de Pokémon inválido:', pokemonId);
        }
    }
});

function getPokemonDetails(pokemonId) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then((response) => response.json())
        .then((pokemon) => convertPokeApiDetailToPokemon(pokemon))
}


modal.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) {
        modal.style.display = 'none';

        // Remova a classe "clicked" apenas do Pokémon com o modal fechado
        if (clickedPokemon) {
            clickedPokemon.classList.remove('clicked');
        }
    }
});
    
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    return pokemon
}
        // --- Substituidos --
        // listItens = []
    
        // for(let i = 0; i < pokemons.length; i++){
        //     const pokemon = pokemons[i];
        //     listItens.push(convertPokemonToLi(pokemon))
        // }
        // console.log(listItens)
    

