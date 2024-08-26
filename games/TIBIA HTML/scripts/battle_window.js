var MONSTER_NAME = ""
var TOTAL_MONSTER_HP = 0
var CURRENT_MONSTER_HP = 0


function open_battle_window(monster_name) {
    //Initialize visuals for the monster
    document.getElementById("monster-hp-bar").style.width = "100%"
    document.getElementById("monster-hp-text").innerHTML = GAME_MONSTERS[monster_name].hp
    document.getElementById("monster-image").src = "images/monsters/" + monster_name + ".gif"

    //Correct monster Hp indicator color
    document.getElementById("monster-hp-bar").classList.remove('battle-hp-yellow')
    document.getElementById("monster-hp-bar").classList.remove('battle-hp-red')
    document.getElementById("monster-hp-bar").classList.add('battle-hp-green')

    //Set variables
    MONSTER_NAME = monster_name
    CURRENT_MONSTER_HP = GAME_MONSTERS[monster_name].hp
    TOTAL_MONSTER_HP = GAME_MONSTERS[monster_name].hp

    //Make the Window Visible and start battle
    document.getElementById("battle-window-title").innerHTML = monster_name.replace("_", " ")
    document.getElementById("battle-window").style.visibility = "visible"

    start_battle()
}

function start_battle() {
    //Start player autotimer
    timer_progress()

    //Start monster autotimer
    monster_timer()
}

function finish_battle() { 
    //Stop the Auto Timer for this battle
    clearInterval(monster_timer_id)
    clearInterval(timer_id)
    timer_set = 0 //so player timer resets after each battle
    monster_set = 0 //so monster timer also resets

    //Give player the EXP and Money reward
    set_player_exp(player_skill.level_exp + GAME_MONSTERS[MONSTER_NAME].exp)
    var min_gold = GAME_MONSTERS[MONSTER_NAME].loot_gold[0]
    var max_gold = GAME_MONSTERS[MONSTER_NAME].loot_gold[1]
    var random_gold = Math.floor(Math.random() * (max_gold - min_gold + 1) + min_gold)
    change_player_money(random_gold)

    //Log Loot message in game chat
    message_in_chat("battle_loot",[random_gold, GAME_MONSTERS[MONSTER_NAME].exp])

    //Start Next Battle
    var next_random_monster = "Rat"// TODO: get from this map's list
    open_battle_window(next_random_monster)
    //close_battle_window()
}

function close_battle_window() {
    //Stop all timers so no battle can be happening in the background
    clearInterval(monster_timer_id)
    clearInterval(timer_id)
    timer_set = 0 //so player timer resets after each battle
    monster_set = 0 //so monster timer also resets

    //Finally hide the window
    document.getElementById("battle-window").style.visibility = "hidden"
}

//****************************************************************************
//Things related to the Player

var timer_set = 0;
var timer_id = ""
function timer_progress() {
    var time_delay = player_status.auto_timer * 10

    if (timer_set == 0) {
        timer_set = 1;
        var elem = document.getElementById("timer-progress");
        var width = 1;
        timer_id = setInterval(animate, time_delay);

        function animate() {
          if (width >= 100) {
            clearInterval(timer_id);
            timer_set = 0;

            //Call for the attack
            auto_timer_finished()

          } else {
            width++;
            elem.style.width = 100-width + "%";
          }
        }
    }
}

function auto_timer_finished() {
    attack_monster(player_status.auto_damage)
}

function attack_monster(damage = player_status.click_damage) {
    //Give player 1 Skill Point per hit
    player_weapon_type = "fist"
    if (player_equipment.weapon != "") {
        var player_weapon_type = GAME_ITEMS.weapon[player_equipment.weapon].type
    }
    set_player_skill_exp(player_weapon_type, player_skill[player_weapon_type + "_exp"] + 1)

    //Very small chance of Increasing player shielding skill if it has a shield
    var on_atk_shielding_chance = 0.05
    var random_roll = Math.random()
    if (player_equipment.shield != "" && on_atk_shielding_chance >= random_roll) {
        set_player_skill_exp("shielding", player_skill.shielding_exp + 1)
    }

    //Maths
    CURRENT_MONSTER_HP = clamp(CURRENT_MONSTER_HP - damage, 0, 999999999)
    var hp_percentage_after_damage = CURRENT_MONSTER_HP/TOTAL_MONSTER_HP * 100

    //Log attack message in game chat
    message_in_chat("player_attack", [damage, MONSTER_NAME.replace("_", " ")])

    //If it was an auto_attack, reset timer
    if (damage == player_status.auto_damage && hp_percentage_after_damage > 0){
        timer_progress()
    }

    //Updates
    document.getElementById("monster-hp-text").innerHTML = CURRENT_MONSTER_HP
    document.getElementById("monster-hp-bar").style.width = hp_percentage_after_damage + "%"

    if (hp_percentage_after_damage <= 50) {
        //change to yellow bar
        document.getElementById("monster-hp-bar").classList.add('battle-hp-yellow')
    }
    if (hp_percentage_after_damage <= 25){
        // change to red
        document.getElementById("monster-hp-bar").classList.add('battle-hp-red')
    }
    if (hp_percentage_after_damage <= 0.9){
        finish_battle()
    }
}

//****************************************************************************
//Things related to the Monster
var monster_set = 0;
var monster_timer_id = ""

function monster_timer() {
    var base_time_reference = 240 //240 base. smaller = faster
    var calc_atks_by_speed = GAME_MONSTERS[MONSTER_NAME].speed
    var monster_timer_delay = base_time_reference / calc_atks_by_speed * 1000 //in miliseconds

    //console.log(monster_timer_delay/1000, " seconds between attacks")

    if (monster_set == 0) {
        monster_set = 1;
        monster_timer_id = setInterval(do_check, monster_timer_delay);

        function do_check() {
            clearInterval(monster_timer_id);
            monster_set = 0;

            //Call for the attack
            monster_atk()
        }    
    }
}

function monster_atk() {
    var real_monster_damage = Math.floor(GAME_MONSTERS[MONSTER_NAME].atk/2 + GAME_MONSTERS[MONSTER_NAME].atk * Math.random() )
    var shield_reduced_damage = player_status.reduced / 100
    real_monster_damage = Math.floor(real_monster_damage - (real_monster_damage*shield_reduced_damage))

    //Check if player Equipment will resist the attack
    if (real_monster_damage <= player_status.resist) {
        //console.log("Player Equipment resisted the attack: ", real_monster_damage)
        message_in_chat("player_resist", [MONSTER_NAME.replace("_", " "), real_monster_damage])
        monster_timer()
        return
    }

    //console.log(MONSTER_NAME, " damage: ", real_monster_damage)

    //Do the Damage or Kill the player with it
    if (player_hp_mp.current_hp > real_monster_damage) {
        change_player_hp(player_hp_mp.current_hp - real_monster_damage)
        message_in_chat("monster_attack", [MONSTER_NAME.replace("_", " "), real_monster_damage])
    } else {
        //console.log("Player should have died.")
        message_in_chat("player_death", [MONSTER_NAME.replace("_", " ")])
        close_battle_window()

        return //for now, just halt everything. TODO: send player back to Town Center and deal penality
    }

    //Increase player shielding skill if it has a shield
    var random_shielding_chance = 0.8
    var random_roll = Math.random()
    if (player_equipment.shield != "" && random_shielding_chance >= random_roll) {
        set_player_skill_exp("shielding", player_skill.shielding_exp + 1)
    }

    //Reset monster timer
    monster_timer()
}
