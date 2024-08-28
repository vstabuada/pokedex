import './App.css';
import { useEffect, useState } from 'react';
import Pokecard from './components/Pokecard';

function App() {
    const [pokedex, setPokedex] = useState([]) // Pokedex da primeira geração (151 pokémons)
    const [pokemons, setPokemons] = useState([]) // Pokémons que estarão visíveis na tela (Existe por motivo de performance de busca)
    const [hasPokemon, setHasPokemon] = useState(true)
    const [shiny, setShiny] = useState(false)

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

        if (searchResult.length < 1) setHasPokemon(false)
        else setHasPokemon(true)
    }

    function toggleShiny(event) {
        const pokeArray = document.querySelectorAll('.Pokeshiny')

        switch (shiny) {
            case false:
                pokeArray.forEach(poke => {
                    const classes = poke.classList
                    const haveClass = classes.contains('ShinyVisible')
                    if (!haveClass) classes.add('ShinyVisible')
                })
                setShiny(x => !x)
                break

            case true:
                pokeArray.forEach(poke => {
                    const classes = poke.classList
                    const haveClass = classes.contains('ShinyVisible')
                    if (haveClass) classes.remove('ShinyVisible')
                })
                setShiny(x => !x)
                break
        }

        const button = event.currentTarget
        button.classList.toggle("toggleShinyActive")
    }

    useEffect(() => {
        async function fetchPokemons(quantity) {
            const pokemonsData = await getPokemons(quantity)
            setPokedex(pokemonsData)
            setPokemons(pokemonsData)
        }

        fetchPokemons(151)

    }, [])

    return (
        <div className="App">
            <header>
                <img src="https://imagensemoldes.com.br/wp-content/uploads/2020/04/Pok%C3%A9mon-PNG.png" alt="Pokemon" className='logo' />
                <div className='headerRight'>
                    <button className='toggleShiny' onClick={(e) => toggleShiny(e)}>Toggle all</button>
                    <input type="text" id="searchbar" placeholder='Search...' autoComplete='false' onChange={(e) => search(e.target.value)} />

                </div>

            </header>
            <div className={pokedex.length < 1 ? "Pokedex Invisible" : "Pokedex"}>
                {hasPokemon ? null : <p className="notfind">Nenhum pokémon foi encontrado!</p>}
                {pokemons.map((pokemon) => { return (<Pokecard key={pokemon.id} pokemon={pokemon} />) })}
            </div>
        </div>
    );
}

export default App;
