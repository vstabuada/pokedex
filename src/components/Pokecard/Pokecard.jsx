import { useEffect, useState } from "react"

function Pokecard({ pokemon }) {
    const [pokemonTypesData, setPokemonTypesData] = useState(null)


    const name = pokemon.name.slice(0, 1).toUpperCase() + pokemon.name.slice(-pokemon.name.length + 1)

    function toggleShiny(event) {
        const { className } = event.target

        if (className.includes("ShinyVisible")) {
            event.target.className = "Pokeimage Pokeshiny"
        } else {
            event.target.className += " ShinyVisible"
        }
    }

    async function fetchTypes() {
        const { types } = pokemon
        const urls = types.map(type => { return type.type.url })
        const promises = await Promise.all(urls.map(url => fetch(url)))
        const data = await Promise.all(promises.map(response => response.json()))

        const typesData = data.map(type => { return { icon: type.sprites["generation-viii"]["legends-arceus"].name_icon, id: type.id, name: type.name } })

        return typesData
    }

    useEffect(() => {

        async function setTypeIcon() {
            const typesData = await fetchTypes()
            setPokemonTypesData(typesData)
        }

        setTypeIcon()
    }, [])


    return (
        <div className="Pokecard">
            <div className="Poketypes">
                {
                    pokemonTypesData ?
                        pokemonTypesData.map(data => { return (<img key={data.id} className="typeLogo" src={data.icon} alt={data.name}></img>) })
                        :
                        pokemon.types.map(() => { return <div className="loadingType"></div> })
                }
            </div>
            <div className="Images" onClick={(event) => { toggleShiny(event) }}>
                <img className="Pokeimage" src={pokemon.sprites.front_default} alt={pokemon.name} ></img>
                <img className="Pokeimage Pokeshiny" src={pokemon.sprites.front_shiny} alt={pokemon.name} ></img>
            </div>
            <p className="Pokename">#{pokemon.id} {name}</p>
        </div>
    )
}
export default Pokecard