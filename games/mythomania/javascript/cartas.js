mythomania_cards = {
    1: {
        "nome": "zeus",
        "magia": 28,
        "força": 28,
        "fogo": 26
      },
   2: {
        "nome": "osíris",
        "magia": 22,
        "força": 24,
        "fogo": 29
      },
   3: {
        "nome": "ísis",
        "magia": 27,
        "força": 14,
        "fogo": 21
      },
   4: {
        "nome": "faraó",
        "magia": 23,
        "força": 20,
        "fogo": 25
      },
   5: {
        "nome": "anúbis",
        "magia": 20,
        "força": 3,
        "fogo": 22
      },
   6: {
        "nome": "posseidon",
        "magia": 21,
        "força": 21,
        "fogo": 27
      },
   7: {
        "nome": "hórus",
        "magia": 19,
        "força": 9,
        "fogo": 23
      },
   8: {
        "nome": "atena",
        "magia": 29,
        "força": 8,
        "fogo": 24
      },
   9: {
        "nome": "hércules",
        "magia": 10,
        "força": 27,
        "fogo": 19
      },
   10: {
        "nome": "aquiles",
        "magia": 9,
        "força": 23,
        "fogo": 18
      },
   11: {
        "nome": "cleópatra",
        "magia": 17,
        "força": 6,
        "fogo": 15
      },
   12: {
        "nome": "medusa",
        "magia": 26,
        "força": 7,
        "fogo": 20
      },
   13: {
        "nome": "maldição do egito",
        "magia": 30,
        "força": 2,
        "fogo": 1
      },
   14: {
        "nome": "fênix",
        "magia": 2,
        "força": 1,
        "fogo": 30
      },
   15: {
        "nome": "caos",
        "magia": 1,
        "força": 29,
        "fogo": 3
      },
   16: {
        "nome": "minotauro",
        "magia": 16,
        "força": 22,
        "fogo": 17
      },
   17: {
        "nome": "ares",
        "magia": 8,
        "força": 25,
        "fogo": 16
      },
   18: {
        "nome": "cérbero",
        "magia": 7,
        "força": 11,
        "fogo": 28
      },
   19: {
        "nome": "esfinge",
        "magia": 24,
        "força": 10,
        "fogo": 12
      },
   20: {
        "nome": "amazona",
        "magia": 15,
        "força": 12,
        "fogo": 10
      },
   21: {
        "nome": "hidra",
        "magia": 18,
        "força": 13,
        "fogo": 4
      },
   22: {
        "nome": "fauno",
        "magia": 6,
        "força": 19,
        "fogo": 14
      },
   23: {
        "nome": "escorpião",
        "magia": 14,
        "força": 5,
        "fogo": 13
      },
   24: {
        "nome": "sereia",
        "magia": 25,
        "força": 4,
        "fogo": 11
      },
   25: {
        "nome": "cronos",
        "magia": 3,
        "força": 30,
        "fogo": 2
      },
   26: {
        "nome": "monstro de areia",
        "magia": 13,
        "força": 18,
        "fogo": 9
      },
   27: {
        "nome": "múmia guerreira",
        "magia": 4,
        "força": 15,
        "fogo": 8
      },
   28: {
        "nome": "crocodilo gigante",
        "magia": 5,
        "força": 26,
        "fogo": 7
      },
   29: {
        "nome": "escaravelho",
        "magia": 12,
        "força": 17,
        "fogo": 6
      },
   30: {
        "nome": "centauro",
        "magia": 11,
        "força": 16,
        "fogo": 5
      }
    
}


function update_card(card_id){
  var card_name = mythomania_cards[card_id].nome
  var card_magia = mythomania_cards[card_id].magia
  var card_força = mythomania_cards[card_id].força
  var card_fogo = mythomania_cards[card_id].fogo

  document.getElementById("card-id").innerHTML = card_id.toString()
  document.getElementById("card-nome").innerHTML = card_name

  if (card_name.length >= 15){
    document.getElementById("card-nome").style.fontSize = "28px"
  } else {
    document.getElementById("card-nome").style.fontSize = "32px"
  }

  document.getElementById("card-art").src = "games/mythomania/_resources/artes/" + card_name + ".png"

  document.getElementById("poder-magia").innerHTML = card_magia
  document.getElementById("poder-forca").innerHTML = card_força
  document.getElementById("poder-fogo").innerHTML = card_fogo
}