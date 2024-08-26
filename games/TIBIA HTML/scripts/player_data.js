// ----------------------------------------------
// This garbage was created in 27/12/2023
// PLAYER CONSTANTS AND VARIABLES

const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

const START_HP = 150
const HP_level_step = 50
const START_MP = 100
const MP_level_step = 30
const START_EXP = 0
const START_BAG_SPACE = 4
const MAX_BAG_SLOTS = 20

var player_hp_mp = {
    "current_hp": START_HP,
    "max_hp": START_HP,
    "current_mp": START_MP,
    "max_mp": START_MP,
}

var player_skill = {
    "level": 1,
    "level_exp": 0,
    "magic": 1,
    "magic_exp": 0,
    "fist": 1,
    "fist_exp": 0,
    "club": 1,
    "club_exp": 0,
    "sword": 1,
    "sword_exp": 0,
    "axe" : 1,
    "axe_exp": 0,
    "distance": 1,
    "distance_exp": 0,
    "shielding": 1,
    "shielding_exp": 0,
    "fishing": 1,
    "fishing_exp": 0,
}

var player_equipment = {
    "helmet" : "", "armor" : "", "legs" : "", "boots" : "",
    "weapon" : "", "shield" : "",
    "amulet" : "", "ring" : "", "ammo" : "",
    "backpack" : "",
}

var player_status = {
    "click_damage" : 0,
    "auto_damage" : 0,
    "auto_timer" : 0,
    "resist" : 0,
    "reduced" : 0
}

var player_money = 0
var inventory_slots = 0 //'update_inventory()' will set to START_BAG_SPACE if 'backpack' == "", else, to backpack slot count
var player_inventory = [] 

// ----------------------------------------------
// PLAYER FUNCTIONS

function start_blank_game(){
    //Set starting values for EXP, Level, HP, MP
    set_player_exp(START_EXP)
    player_skill.level = 0
    player_level_up()
    change_player_hp(START_HP)
    change_player_mp(START_MP)

    //Set starting values for each skill
    for (skill_name in tibia_skill_experience){
        set_player_skill_exp(skill_name, START_EXP)
    }

    //Set starting values for Money
    player_money = 0
    change_player_money(0)

    //Update inventory, at start it will blank out the placeholder sprites
    update_inventory()

    //Set initial player Attack and Defense values
    update_player_status()
}

//PLAYER LEVEL
function set_player_exp(exp_value){
    //set player EXP to the passed value
    player_skill.level_exp = exp_value

    //Update EXP count on screen with comma separated thousands
    var exp_with_commas = player_skill.level_exp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("exp-value").innerHTML = exp_with_commas

    //verify EXP value needed for next level
    var next_level_exp = tibia_level_experience[player_skill.level + 1]

    //if current total EXP is enough to level up, call player_skill_level_up()
    if (player_skill.level_exp >= next_level_exp) {
        //Check how many Levels player has actually got
        var level_reached = player_skill.level
        for (level in tibia_level_experience){
            if (player_skill.level_exp >= tibia_level_experience[level]) {
                level_reached = level
            }else{
                break
            }            
        }

        //Call one 'player_level_up()' for each actual level gained
        var difference_in_levels = level_reached - player_skill.level
        for (let i=0; i < difference_in_levels; i++){
            player_level_up()
        }

        //re-check for updates bellow
        var next_level_exp = tibia_level_experience[player_skill.level + 1]
    }

    //update visuals
    var exceeding_exp = player_skill.level_exp - tibia_level_experience[player_skill.level]
    var percentage_reached = clamp(exceeding_exp/(next_level_exp-tibia_level_experience[player_skill.level]), 0, 100)

    document.getElementById("exp-progress").style.width = percentage_reached * 100 + "%"
}
function player_level_up(){
    //Update the Level value
    player_skill.level += 1
    document.getElementById("level-value").innerHTML = player_skill.level

    //Update Total HP, MP, and Heal the player
    player_hp_mp.max_hp += HP_level_step
    player_hp_mp.max_mp += MP_level_step

    change_player_hp(player_hp_mp.max_hp)
    change_player_mp(player_hp_mp.max_mp)

    //Log in chat
    if (player_skill.level > 1) {
        message_in_chat("level_up", [player_skill.level])
    }

    //Update player status
    update_player_status()
}

//PLAYER SKILLS
function set_player_skill_exp(skill_name, exp_value){
    //set player EXP to the passed value
    var composite_skill_name_exp = skill_name + "_exp"
    player_skill[composite_skill_name_exp] = exp_value

    //verify EXP value needed for next level
    var current_skill_level = player_skill[skill_name]
    var next_level_exp = tibia_skill_experience[skill_name][current_skill_level]
   
    //if current total EXP is enough to level up, call player_skill_level_up()
    if (player_skill[composite_skill_name_exp] >= next_level_exp) {
        player_skill_level_up(skill_name)

        //re-check this value for updates bellow
        next_level_exp = tibia_skill_experience[skill_name][player_skill[skill_name]]
    }

    //update visuals
    var composite_skill_name_progress = skill_name + "-progress"
    document.getElementById(composite_skill_name_progress).style.width = player_skill[composite_skill_name_exp]/next_level_exp * 100 + "%"
}
function player_skill_level_up(skill_name){
    //Update the Level value
    player_skill[skill_name] += 1
    document.getElementById(skill_name + "-value").innerHTML = player_skill[skill_name]

    //When leveling up, remove the used 'skill_exp' from the previous level so the player has to get the total amount for the next level from scratch
    var exp_left_after_level_up = player_skill[skill_name + "_exp"] - tibia_skill_experience[skill_name][player_skill[skill_name] - 1]
    player_skill[skill_name + "_exp"] = exp_left_after_level_up

    //Update player status
    update_player_status()
}

//PLAYER HP and MP
function change_player_hp(hp_value){
    player_hp_mp.current_hp = hp_value

    //Make sure the MAX HP is correct, prevents cheating, bugs and all
    player_hp_mp.max_hp = START_HP + (HP_level_step * (player_skill.level - 1))

    document.getElementById("hp-indicator").innerHTML = player_hp_mp.current_hp + "/" + player_hp_mp.max_hp;
    document.getElementById("HP-bar").style.width = player_hp_mp.current_hp/player_hp_mp.max_hp * 100 + "%"
}
function change_player_mp(mp_value){
    player_hp_mp.current_mp = mp_value

    //Make sure the MAX MP is correct, prevents cheating, bugs and all
    player_hp_mp.max_mp = START_MP + (MP_level_step * (player_skill.level - 1))

    document.getElementById("mp-indicator").innerHTML = player_hp_mp.current_mp + "/" + player_hp_mp.max_mp;
    document.getElementById("MP-bar").style.width = player_hp_mp.current_mp/player_hp_mp.max_mp * 100 + "%"
}

//PLAYER ATTACK AND DEFENSE
function update_player_status(){
    //ATTACK
    if (player_equipment.weapon != "") {
        //Basic Weapon Information
        var weapon_type = GAME_ITEMS.weapon[player_equipment.weapon].type
        var weapon_atk = GAME_ITEMS.weapon[player_equipment.weapon].atk
        //console.log(player_equipment.weapon, ": ", weapon_type, ", atk:", weapon_atk)
    }else{
        //Fist "weapon" basics
        var weapon_type = "fist"
        var weapon_atk = 1
    }

    //Click Damage
    var step = 4
    var base_atk_by_level = (((player_skill.level + 1000)/step) - (48*step)) + 100*step - 450
    var base_atk_by_skill = (6/5 * weapon_atk) * ((player_skill[weapon_type] + 5)/15)
    var base_damage_formula = Math.ceil(base_atk_by_level) + Math.floor(base_atk_by_skill)

    player_status.click_damage = base_damage_formula
    document.getElementById("click-damage").innerHTML = player_status.click_damage

    //Auto Damage
    var skill_influence = (player_skill[weapon_type] + 5)/15
    var auto_damage = Math.floor(base_damage_formula * skill_influence)

    player_status.auto_damage = auto_damage
    document.getElementById("auto-damage").innerHTML = player_status.auto_damage

    //Auto Timer
    var timer_step = 0.005
    var auto_timer = ( 5.0/(skill_influence*1.25) ) - (player_skill.level*timer_step)

    player_status.auto_timer = auto_timer.toFixed(2)
    document.getElementById("auto-timer").innerHTML = player_status.auto_timer

    //DEFENSE
    var shield_def = 0
    if (player_equipment.shield != "") {
        //Basic Shield Information
        shield_def = GAME_ITEMS.shield[player_equipment.shield].def
        //console.log(player_equipment.shield, shield_def)
    }

    //Reduced
    var base_reduced = (shield_def)/45
    var shielding_influence = player_skill.shielding * 0.666
    var reduced_formula = base_reduced * shielding_influence

    player_status.reduced = reduced_formula.toFixed(2)
    document.getElementById("reduced").innerHTML = player_status.reduced + "%"

    //Resist
    var resist_base = 0
    var list_of_equip_types = ["helmet", "armor", "legs", "boots"]

    for (let i=0; i < list_of_equip_types.length; i++){
        var item_type = list_of_equip_types[i]
        var player_item_name = player_equipment[item_type]

        if (player_item_name != ""){
            resist_base += GAME_ITEMS[item_type][player_item_name].arm
        }
    }

    var resist_formula = resist_base + (resist_base * shielding_influence * 0.05)
    player_status.resist = Math.floor(resist_formula)
    document.getElementById("resist").innerHTML = player_status.resist
}

//PLAYER MONEY
function change_player_money(value_change){
    //Catch the case for negative money lol
    if (player_money <= 0 && value_change < 0){
        player_money = 0 //set it to be sure
        return //exit the function
    }

    player_money += value_change

    //separe the money in Gold, Platinum and Crystal coins
    var gold = 0; var platinum = 0; var crystal = 0
    var dividing_money = player_money

    if (dividing_money >= 10000) {
        crystal = (dividing_money - (dividing_money%10000)) / 10000
        dividing_money = dividing_money - (crystal*10000)
    }

    if (dividing_money >= 100) {
        platinum = (dividing_money - (dividing_money%100)) / 100
        dividing_money = dividing_money - (platinum*100)
    }

    gold = clamp(dividing_money, 0, 99)

    //Update the visuals in the Inventory window
    document.getElementById("money-gold").innerHTML = gold

    if (platinum > 0 || crystal > 0){
        document.getElementById("platinum-display").style.visibility = "visible"
        document.getElementById("money-platinum").innerHTML = platinum
    }else{
        document.getElementById("platinum-display").style.visibility = "hidden"
    }

    if (crystal > 0){
        document.getElementById("crystal-display").style.visibility = "visible"
        document.getElementById("money-crystal").innerHTML = crystal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }else{
        document.getElementById("crystal-display").style.visibility = "hidden"
    }
}

//-------------------------------------------------------------
// PLAYER INVENTORY MANAGEMENT

function add_inventory_item(item_category, item_name) {
    //Categories from 'game_items.js' consts
    //'item_name' must be an entry of that category

    //If there is no Inventory Slot free to receive item, it just isn't added
    if (player_inventory.length >= inventory_slots){
        var error_message = "Not possible to add " + item_name + " item. Inventory full"
        return error_message
    }

    var new_item_register = [item_category, item_name]

    player_inventory.push(new_item_register)
    update_inventory()
}

function remove_inventory_item(item_category, item_name) {
    for (let i=0; i < player_inventory.length; i++){
        if (player_inventory[i][0] == item_category && player_inventory[i][1] == item_name) {
            player_inventory.splice(i, 1)
            update_inventory()

            break //break out so it stops after removing one copy of the item, in case it has more lol
        }
    }
}

function update_inventory(){
    //Check for bag slots
    if (player_equipment.backpack == ""){
        inventory_slots = START_BAG_SPACE
    }else{
        inventory_slots = GAME_ITEMS.backpack[player_equipment.backpack].slots
    }

    //hide the entire row that isn't visible
    for (let i=1; i < (MAX_BAG_SLOTS +1)/4; i++){
        document.getElementById("row" + i).style.visibility = "hidden"
    }
    //Show the row that should be visible, minimum is 1 set by START_BAG_SPACE being = 4
    for (let i=1; i < (inventory_slots +1)/4; i++){
        document.getElementById("row" + i).style.visibility = "visible"
    }
    
    //First hide the item sprites
    for (let i=1; i < MAX_BAG_SLOTS +1; i++){
        document.getElementById("bag_sprite" + i).style.visibility = "hidden"
        document.getElementById("bag_sprite" + i).title = ""
    }
    //Show in order the items in 'player_inventory'
    for (let i=0; i < player_inventory.length; i++){
       document.getElementById("bag_sprite" + (i+1)).src = "images/icons/items/" + player_inventory[i][0] + "/" + player_inventory[i][1] + ".gif"
       document.getElementById("bag_sprite" + (i+1)).style.visibility = "visible"

       //Change item description element
       var status_to_show = ""
       var item_category = player_inventory[i][0].toLowerCase()
       var item_name = player_inventory[i][1]

       switch (item_category){
           case 'weapon':status_to_show = "Atk"; break
           case 'shield': status_to_show = "Def"; break
           case 'backpack':status_to_show = "Slots"; break
           default: status_to_show = "Arm"
       }
       document.getElementById("bag_sprite" + (i+1)).title = item_name.toUpperCase().replace("_", " ") + "\n" + status_to_show +": " + GAME_ITEMS[item_category][item_name][status_to_show.toLowerCase()]
    }
}

function debug_add_full_set(){
    add_inventory_item("WEAPON", "katana")
    add_inventory_item("SHIELD", "copper_shield")
    add_inventory_item("HELMET", "legion_helmet")
    add_inventory_item("ARMOR", "chain_armor")
    add_inventory_item("LEGS", "studded_legs")
    add_inventory_item("BOOTS", "leather_boots")
}

//-------------------------------------------------------------------
// Using Item from inventory logic

function use_item_from_inventory(slot_index) {
    //If there is no item at that slot, exit the function
    if (player_inventory.length < slot_index){
        return
    }

    //Get the category and name of the item on the clicked slot (have to move the index -1, it's easier)
    var item_category = player_inventory[slot_index-1][0].toLowerCase()
    var item_name = player_inventory[slot_index-1][1]

    //Equipable items are the ones with keys in 'player_equipment'   
    if (Object.keys(player_equipment).includes(item_category)){
        //Check for an already equipped item at that slot, if there is, deEquip it first
        if (player_equipment[item_category] != "") {
            deEquip_item(item_category)
        }

        //Equip the item that was clicked
        if (player_equipment[item_category] == "") {
            player_equipment[item_category] = item_name
            document.getElementById("equip_" + item_category).src = "images/icons/items/" + item_category + "/" + item_name + ".gif"
            
            //Change item description element
            var status_to_show = ""
            switch (item_category){
                case 'weapon':status_to_show = "Atk"; break
                case 'shield': status_to_show = "Def"; break
                case 'backpack':status_to_show = "Slots"; break
                default: status_to_show = "Arm"
            }
            document.getElementById("equip_" + item_category).title = item_name.toUpperCase().replace("_", " ") + "\n" + status_to_show +": " + GAME_ITEMS[item_category][item_name][status_to_show.toLowerCase()]

            //Remove it from player inventory
            remove_inventory_item(item_category.toUpperCase(), item_name)
        }
    }

    //TODO: Items that can be used from the bag, such as Foods and Potions
    //...

    //Recalculate player's Attack and Defense based on items it has equipped
    update_player_status()
}

function deEquip_item(item_category) {
    //If there is no item at that slot, exit the function
    if (player_equipment[item_category] == "") {
        return
    }
    //If there is no free Backpack Slots, exit the function
    if (player_inventory.length >= inventory_slots){
        return
    }
    //If there's more items in inventory than a "no backpack" status would allow, exit the function
    if (item_category == "backpack" && player_inventory.length >= START_BAG_SPACE){
        return
    }

    //Add it to the player's Inventory again while the reference still exists
    add_inventory_item(item_category.toUpperCase(), player_equipment[item_category])

    //Reset the Title indicator to it's null state
    var str = item_category
    document.getElementById("equip_" + item_category).title = str.charAt(0).toUpperCase() + str.slice(1);

    //Remove item from equipment slot, reset "empty" sprite to it
    player_equipment[item_category] = ""
    document.getElementById("equip_" + item_category).src = "images/ui/No" + item_category + ".png"
    update_inventory() //I have to update again to be sure

    //Recalculate player's Attack and Defense based on items it has equipped
    update_player_status()
}