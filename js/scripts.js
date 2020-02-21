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
        type: ['grass' ,'poison'], 
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


for (var i = 0; i < repository.length; i++) {
    if (repository[i].height >= 1) {
        var heightdisplay = " wow thats big!"
    }
    else {
        var heightdisplay = ''
    }
    document.write(repository[i].name + ' ' + repository[i].height + '' + heightdisplay +'<br>')
    if (repository[i].height >= 1) {
    }
}