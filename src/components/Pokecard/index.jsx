function Pokecard({ pokemon }) {

    const name = pokemon.name.slice(0, 1).toUpperCase() + pokemon.name.slice(-pokemon.name.length + 1)

    return (
        <div className="Pokecard">
            <div className="Images">
                <img className="Pokeimage" src={pokemon.sprites.front_default} alt={pokemon.name} ></img>
                <img className="Pokeimage Pokeshiny" src={pokemon.sprites.front_shiny} alt={pokemon.name} ></img>
            </div>
            <p className="Pokename">{name}</p>
        </div>
    )
}
export default Pokecard