//https://medium.com/@onlinemsr/javascript-string-format-the-best-3-ways-to-do-it-c6a12b4b94ed
const formatString = (template, ...args) => {
    return template.replace(/{([0-9]+)}/g, function (match, index) {
      return typeof args[index] === 'undefined' ? match : args[index];
    });
}
////////////////////////////////



BASE_PLAYER_ATK = "You did {0} damage to {1}!"
BASE_MONSTER_ATK = "{0} has dealt {1} damage to you."
BASE_PLAYER_DEATH = "You died to a {0}'s attack."
BASE_PLAYER_RESIST = "Your Equipment resisted {0}'s {1} damage!"
BASE_BATTLE_LOOT = "You got {0} Gold and {1} EXP after your Battle!"
BASE_LEVEL_UP = "You have reached Level {0}!"
BASE_PLAYER_DEATH = "You have died and lost 10% of your EXP and 1% of your Gold."



function message_in_chat(message_type, passed_args = []) {
    var new_log_message = "Nothing. Error. Null. Fix this!"
    console.log(message_type, passed_args)

    switch (message_type) {
        case "player_attack" :
            var player_damage = passed_args[0]
            var monster_name = passed_args[1]
            new_log_message = formatString(BASE_PLAYER_ATK, player_damage, monster_name)
            break
        case "monster_attack" :
            var monster_name = passed_args[0]
            var monster_damage = passed_args[1]
            new_log_message = formatString(BASE_MONSTER_ATK, monster_name, monster_damage)
            break
        case "player_death" :
            var monster_name = passed_args[0]
            new_log_message = formatString(BASE_PLAYER_DEATH, monster_name)
            break
        case "player_resist" :
            var monster_name = passed_args[0]
            var monster_damage = passed_args[1]
            new_log_message = formatString(BASE_PLAYER_RESIST, monster_name, monster_damage)
            break
        case "battle_loot" :
            var loot_gold = passed_args[0]
            var reward_exp = passed_args[1]
            new_log_message = formatString(BASE_BATTLE_LOOT, loot_gold, reward_exp)
            break
        case "level_up" :
            var level_reached = passed_args[0]
            new_log_message = formatString(BASE_LEVEL_UP, level_reached)
            break
        default:
            new_log_message = "Couldn't find anything to log."
    }

    //Update the Log with the new message
    update_chat_log(new_log_message)
}

function update_chat_log(new_message) {
    //Setup new message order
    line1_message = document.getElementById('line-previous').innerText
    line2_message = document.getElementById('line-current').innerText
    line3_message = new_message

    //Visually change the messages
    document.getElementById("line-older").innerHTML = line1_message
    document.getElementById("line-previous").innerHTML = line2_message
    document.getElementById('line-current').innerHTML = line3_message    
}