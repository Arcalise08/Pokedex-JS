


var masterPoke = (function() {
    pokedex = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    var $pokemoncontainer = document.querySelector('.pokeman-list');

    //handles loading text
    function loadingMessage() {
        var loading = document.querySelector('#loading');
        loading.classList.toggle('is-visible');
        console.log(loading);
    }
    //gets Pokemon name list from API
    function getApiList() {
        loadingMessage();
        fetch(apiUrl).then(function(response) {
            return response.json()
        }).then(function(json) {
            json.results.forEach(function(item) {
                var tempPoke = {
                    name: item.name,
                    detailsurl: item.url,
                };
                getPokeDetails(tempPoke)
            })
            
        })};

        //gets further small details for each pokemon.
        function getPokeDetails(pokemon) {
            var url = pokemon.detailsurl
            fetch(url).then(function(response){
            return response.json()
        }).then(function(details) {
            
            pokemon.id = details.id
            pokemon.imageUrl = details.sprites.front_default;
            pokemon.height = details.height;
            pokemon.speciesUrl = details.species.url;
            //for adding pokemon types(API shows types out of order)
            //I.E bulbasaur would be poison instead of grass first without this.
            if (details.types.length === 2) {
                pokemon.type0 = details.types[1].type.name;
                pokemon.type1 = details.types[0].type.name;
            }
            
            else{
                pokemon.type0 = details.types[0].type.name;
            };
            //Adds the '0.' for under 1m height and 'm' indicator at end.
            if (pokemon.height < 10) {
                pokemon.height = '0.' + pokemon.height + 'm';
            }
            else {
                pokemon.height = pokemon.height + 'm';
            }
            pokedex.push(pokemon);

        }).then(function(){
            sortPokedex();
        })
        }

        //Sorts pokedex var by pokemon number
        function sortPokedex() {
            if (pokedex.length === 150) {
            pokedex.sort(function(a, b) {
                return a.id - b.id;
            });
            createListItems();
            }
        }
        //Creates name list and buttons for simple list
        function createListItems() {
            if (pokedex.length === 150) {
            pokedex.forEach(function(pokemon) {
                
            var $listItem = document.createElement('li');
            var $button = document.createElement('button');
            $button.innerText = (pokemon.name);
            $button.className = 'listItem'
            $listItem.appendChild($button);
            $pokemoncontainer.appendChild($listItem);
            styleButton(pokemon, $button);
            
        })
        loadingMessage();
        }
    }
        //styles buttons based on pokemans primary type
        function styleButton(pokemon, $button) {
                $button.className = pokemon.type0;
                addListener(pokemon, $button);
        }

        //adds listener on button & loads details on click
        function addListener(pokemon, $button) {
            $button.addEventListener('click', function () {
                loadMoreDetails(pokemon);
            })
        }

        //loads more data from specific pokemon URL from API.
        function loadMoreDetails(pokemon) {
            var url = pokemon.speciesUrl;
            var enBox = [];
            fetch(url).then(function(response) {
                return response.json()
            }).then(function(details){
                details.flavor_text_entries.forEach(function(details) {

                    if (details.language.name === "en") {
                        var enDetails = {
                        text: details.flavor_text
                    }
                        enBox.push(enDetails);
                    }
                })
                }).then(function() {
                //shows summary text 0(can be changed for different summary text.)
                pokemon.summary = enBox[0].text;
                createModal(pokemon);
            })
        }
        //creates popup modal with pokemon details.
        function createModal(pokemon) {
            var pokeyContainer = document.querySelector('#detailsContainer');
            var pokeyBox = document.querySelector('#detailsList');
            var pokeName = document.createElement('h1');
            var pokeInfo = document.createElement('p');
            var pokeImg = document.createElement('img');
            var closeButton = document.createElement("button");
            var pokeHeight = document.createElement('p');

            clickOutModal(closeButton, pokeyContainer, pokeyBox)
            buttonClickOut(closeButton, pokeyContainer, pokeyBox)
            escapeOutModal(closeButton, pokeyContainer, pokeyBox)
            
            pokeHeight.innerHTML = ('<h2>Height: </h2>' + pokemon.height);
            closeButton.innerHTML = "X";

            pokeName.innerHTML = (pokemon.name);
            pokeName.style.fontSize = "300%";
            pokeInfo.innerHTML = ('<h2>Summary</h2>' + pokemon.summary);

            pokeName.classList.add('modal-title')
            closeButton.classList.add('closeButton')
            pokeInfo.classList.add('summaryDetails')
            pokeImg.classList.add('modalImg')
            pokeHeight.classList.add('modalHeight')

            pokeImg.setAttribute("src", pokemon.imageUrl);

            pokeyBox.appendChild(closeButton);
            pokeyBox.appendChild(pokeName);
            pokeyBox.appendChild(pokeImg);
            pokeyBox.appendChild(pokeInfo);
            pokeyBox.appendChild(pokeHeight);
            pokeyContainer.classList.add('is-visible');
            
        }
        
        //closes modal on button close
        function buttonClickOut(button, container, list) {
                button.addEventListener('click', function () {
                    closeModal(button, container, list);
                })
        }
        //closes modal on container click out
        function clickOutModal(button, container, list) {
                container.addEventListener('click', (e) => {
                var target = e.target;

                if (target === container) {
                    closeModal(button, container, list)
                }
            });
            }
        //closes modal on escape button.
        function escapeOutModal(button, container, list) {
            window.addEventListener('keydown',function(k) {
                if (k.key === 'Escape' && container.classList.contains('is-visible'))
                closeModal(button, container, list);
            })
        }
        //does the actual closing
        function closeModal(button, container, list) {
            container.classList.remove('is-visible');
            console.log('!!!!')
            list.innerHTML = " ";
            }
        //returns all pokemon
        function getAll() {
            return pokedex
        }
    //available commands
    return {
    getApiList: getApiList,
    getAll: getAll,
    loadingMessage: loadingMessage,
    }
})();

masterPoke.getApiList();




