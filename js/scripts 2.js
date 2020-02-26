/* 
usage to add new pokemon---
pokeydata.add({name: "name", height: number , type: ["pokemontype"]}) 
usage to add new pokemon to list
pokeydata.addListItem({name: 'pokemon-name, height: number, type:['pokemontype']})
*/

/*Pokemon List Container*/


/* Pokedex storage data */

var pokeydata = (function() {
    var pokedex = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemoncontainer = document.querySelector('.pokeman-list');
    

    function addColor(pokemon) {
        if (pokemon.type0 === "fire") {
        console.log(pokemon);
        }
    }

    function loadListdata() {
        fetch(apiUrl).then(function(response) {
            return response.json()
        }).then(function(json) {
            json.results.forEach(function(item) {

            var pokeyman = {
                name: item.name,
                detailsurl: item.url,
            };
            
            loadDetails(pokeyman)
            add(pokeyman);
            
            })
        }).catch(function(error) {
            console.log(error)
        })
    }

    /*loads details from pokey URL*/
    function loadDetails(currentPoke) {
        var url = currentPoke.detailsurl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
        
            currentPoke.imageUrl = details.sprites.front_default;
            currentPoke.height = details.height;
            
            if (details.types.length === 2) {
                currentPoke.type0 = details.types[1].type.name;
                currentPoke.type1 = details.types[0].type.name;
            }
            
            else{
                currentPoke.type0 = details.types[0].type.name;
            };
            addColor(currentPoke);
        }).catch(function (e) {
            console.error(e);
        });
    }
    
    /*adds click event listener to button*/  
    function addEventButton($button, currentPoke) {
        $button.addEventListener('click', function () {
            var pokeyBox = document.querySelector('#detailsContainer')
            showDetails(currentPoke);
            pokeyBox.classList.add('is-visible');
        })};

    /*handles posting details to modal*/
    function showDetails(item) {
            console.log(item); 
    }
    
    function createListItem(currentPoke) {

        /**/        
        var $listItem = document.createElement('li');
        var $button = document.createElement('button');
        $button.innerText = (currentPoke.name);
        $button.className = 'listItem'
        $listItem.appendChild($button);
        $pokemoncontainer.appendChild($listItem);
        addEventButton($button, currentPoke);
            
        
            
    }

    function add(pokemon) {
        pokedex.push(pokemon);
        createListItem(pokemon);
    }


    /*Returns pokemon data*/
    function getAll() {
        return pokedex
    }



    /*Color Handler*/

    function addColor(pokemon) {
        if (pokemon.type0 === "fire") {

        console.log(pokemon.getContainer);
        }
    }




        /*Usable Commands*/
    return {
        add: add,
        addcolor: addColor,
        getAll: getAll,
        addEventButton: addEventButton,
        loadListdata: loadListdata,
        loadDetails: loadDetails,
        showDetails: showDetails,
    
        };
})();


pokeydata.loadListdata();
pokeydata.getAll();

