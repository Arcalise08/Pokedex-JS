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
    

    function createListItem(currentPoke) {

            /**/        
            var $listItem = document.createElement('li');
            var $button = document.createElement('button');
            $button.innerText = (currentPoke.name);
            $listItem.appendChild($button);
            $pokemoncontainer.appendChild($listItem);
            addEventButton($button, currentPoke);
    }

    function loadListdata() {
        fetch(apiUrl).then(function(response) {
            return response.json()
        }).then(function(json) {
            json.results.forEach(function(item) {

            var pokeyman = {
                name: item.name,
                detailsurl: item.url
            };
            
            add(pokeyman);
            })
        }).catch(function(error) {
            console.log(error)
        })
    }


    /*adds click event listener to button*/  
    function addEventButton($button, currentPoke) {
        $button.addEventListener('click', function () {
            showDetails(currentPoke);
        })};

    function showDetails(item) {
        pokeydata.loadDetails(item).then(function () {
            console.log(item);   });
    }

        function loadDetails(currentPoke) {
            var url = currentPoke.detailsurl;
            return fetch(url).then(function (response) {
                return response.json();
            }).then(function (details) {
              // Now we add the details to the item
                currentPoke.imageUrl = details.sprites.front_default;
                currentPoke.height = details.height;
                currentPoke.types = Object.keys(details.types);
            }).catch(function (e) {
                console.error(e);
            });
        }
    

    function add(pokemon) {
        pokedex.push(pokemon)
        createListItem(pokemon)
    }
    
        /*Returns pokemon data*/
    function getAll() {
        return pokedex
    }

        /*Usable Commands*/
    return {
        add: add,
        getAll: getAll,
        addEventButton: addEventButton,
        loadListdata: loadListdata,
        loadDetails: loadDetails,
        showDetails: showDetails,
        };

})();


pokeydata.loadListdata();

