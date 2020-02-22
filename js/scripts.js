/*This is for later 
/*    squirtle: {type: 'water', height: 0.5},
    charmander: {type: 'fire', height: 0.6}, */
var damage = null
var weak = damage * 2
var strong = damage / 2

/*Pokedex Start */
var repository = [
    {
        name:'bulbasaur', 
        type: ['grass' ,' poison'], 
        height: 0.8
    },
    {
        name:'squirtle', 
        type: ['water'],
        height: 0.5
    },
    {
        name:'charizard', 
        type: ['fire'],
        height: 1.7
    },
]


repository.forEach(function(currentName){
    document.write('<p>'+'name: '+'<strong>'+currentName.name+'</strong>'+'</p>')
    document.write('<p>'+'height: '+ currentName.height+'</p>')
    document.write('<p>'+'type: ' + currentName.type+'</p>')
});
