import './App.css';
import { useEffect, useState } from 'react';
import Pokecard from './components/Pokecard';

function App() {
    const [pokedex, setPokedex] = useState([]) // Pokedex da primeira geração (151 pokémons)
    const [pokemons, setPokemons] = useState([]) // Pokémons que estarão visíveis na tela (Existe por motivo de performance de busca)

    //     poke.sort(function (a, b) { // Organiza os pokémons
    //         if (a.id > b.id) { return 1 }
    //         if (a.id < b.id) { return -1 }
    //         return 0
    //     })

    async function getPokemons(limit) { // Deve ser executado apenas uma vez
        const pokelist = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)

        const pokelistData = await pokelist.json()

        const urls = pokelistData.results.map(pokemon => pokemon.url)

        const promises = await Promise.all(urls.map(x => fetch(x)))

        const data = await Promise.all(promises.map(response => response.json()))

        return data
    }






    function search(string) {
        const searchResult = []

        pokedex.map((poke) => {
            if (poke.name.includes(string.toLowerCase())) searchResult.push(poke)
        })

        setPokemons(!string ? pokedex : searchResult)
    }



    useEffect(() => {
        async function fetchPokemons(quantity) {
            const pokemonsData = await getPokemons(quantity)
            setPokedex(pokemonsData)
            setPokemons(pokemonsData)

            console.log(pokemonsData[13].sprites.front_default)
        }

        fetchPokemons(151)

    }, [])

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
