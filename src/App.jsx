import './App.css';
import { useEffect, useState } from 'react';
import Pokecard from './components/Pokecard/Pokecard';

function App() {
    const [pokedex, setPokedex] = useState([]) // Pokedex da primeira geração (151 pokémons)
    const [pokemons, setPokemons] = useState([]) // Pokémons que estarão visíveis na tela (Existe por motivo de performance de busca)
    const [hasPokemon, setHasPokemon] = useState(true)
    const [shiny, setShiny] = useState(false)

    async function getPokemons(limit) { // Deve ser executado apenas uma vez
        const pokelist = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
            .catch(e => console.log(e))

        const pokelistData = await pokelist.json()

        const urls = pokelistData.results.map(pokemon => pokemon.url)

        const promises = await Promise.all(urls.map(x => fetch(x).catch(e => console.log(e))))

        const data = await Promise.all(promises.map(response => response.json()))

        return data
    }

    function search(string) {
        const searchResult = pokedex.filter(poke => {
            const name = `#${poke.id} ${poke.name}`

            return name.includes(string.toLowerCase())
        })

        setPokemons(!string ? pokedex : searchResult)

        if (searchResult.length < 1) setHasPokemon(false)
        else setHasPokemon(true)
    }

    function toggleAllShiny(event) {
        const pokeArray = document.querySelectorAll('.Pokeshiny')

        switch (shiny) {
            case false:
                pokeArray.forEach(poke => {
                    const haveClass = poke.classList.contains('ShinyVisible')
                    if (!haveClass) poke.classList.add('ShinyVisible')
                })
                setShiny(x => !x)
                break

            case true:
                pokeArray.forEach(poke => {
                    const haveClass = poke.classList.contains('ShinyVisible')
                    if (haveClass) poke.classList.remove('ShinyVisible')
                })

                setShiny(x => !x)
                break
        }

        const button = event.currentTarget
        button.classList.toggle("toggleShinyActive")

        console.log(pokedex[39])
    }

    function showLoading() {
        if (pokedex.length < 1) {
            return (
                <div className='Loading'>
                    <div className="loading">
                        <div id="dot1" className="dots"></div>
                        <div id="dot2" className="dots"></div>
                        <div id="dot3" className="dots"></div>
                    </div>
                </div>
            )
        }
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
                    <button className='toggleShiny' onClick={(e) => toggleAllShiny(e)}>Toggle all</button>
                    <input type="text" id="searchbar" placeholder='Search...' autoComplete='false' onChange={(e) => search(e.target.value)} />
                </div>
            </header>

            {showLoading()}
            <div className={pokedex.length < 1 ? "Pokedex Invisible" : "Pokedex"}>
                {hasPokemon ? null : <p className="notfind">Nenhum pokémon foi encontrado!</p>}
                {pokemons.map((pokemon) => { return (<Pokecard key={pokemon.id} pokemon={pokemon} />) })}
            </div>
        </div>
    );
}

export default App;
