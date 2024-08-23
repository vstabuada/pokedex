import './App.css';
import { useEffect, useState } from 'react';
import Pokecard from './components/Pokecard';

function App() {
    const [pokedex, setPokedex] = useState([]) // Pokedex da primeira geração (151 pokémons)
    const [pokemons, setPokemons] = useState([]) // Pokémons que estarão visíveis na tela (Existe por motivo de performance de busca)

    async function getPokedex() { // Deve ser executado apenas uma vez

        const pokelist = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`).then(res => res.json()).then(response => {
            const poke = []

            response.results.map(async x => {
                const pokemon = await fetch(x.url).then(res => res.json())
                poke.push(pokemon)
            })

            poke.sort(function (a, b) { // Organiza os pokémons
                if (a.id > b.id) { return 1 }
                if (a.id < b.id) { return -1 }
                return 0
            })

            return poke
        })

        setPokedex(pokelist)
        setPokemons(pokelist)

    }

    function search(string) {
        const searchResult = []

        pokedex.map((poke) => {
            if (poke.name.includes(string.toLowerCase())) searchResult.push(poke)
        })

        setPokemons(!string ? pokedex : searchResult)
    }

    useEffect(() => { getPokedex() }, [])

    return (
        <div className="App">
            <header>
                <input type="text" id="searchbar" autoComplete='false' onChange={(e) => search(e.target.value)} />

            </header>
            <div className="Pokedex">
                {pokemons.map((pokemon) => { return (<Pokecard key={pokemon.id} pokemon={pokemon} />) })}
            </div>
        </div>
    );
}

export default App;
