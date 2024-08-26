

function populate_cards_list_dropdown_menu(){
    var lista = document.getElementById("lista-de-cartas")
    var options = Object.keys(mythomania_cards)

    //console.log(options)
   
    for (let i=1; i <= options.length; i++){
        var opt = document.createElement('option');
        opt.value = i;
        opt.text = mythomania_cards[i].nome.toUpperCase();

        lista.options.add(opt);
    }
}