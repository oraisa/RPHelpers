
/*jslint node: true*/
/*jslint browser: true*/
/*jshint esversion: 6*/
"use strict";
const {ipcRenderer} = require("electron");
let $ = window.$ = window.jQuery = require(__dirname + '/jquery-2.1.4.min.js');

$(document).ready(function(){
    let num_counters = 0;
    add_counter(num_counters++);

    $("#add-counter-button").click(function(){
        add_counter(num_counters++);
    });

    $("#roll-button").click(function(){
        let num_dice = parseInt($("#num-dice").val());
        let dice_type = parseInt($("#dice-type").val());
        let result = 0;
        let result_string = "";
        for(let i = 0; i < num_dice; i++){
            let dice = Math.floor(Math.random() * dice_type) + 1;
            result += dice;
            result_string += dice.toString() + " ";
        }
        $("#dice-result").html(result.toString());
        $(".result-breakdown").html(result_string);
        $(".result-breakdown").css("visibility", "visible");
    });

    $("#save-button").click(() => {
        let obj = {
            dice: {
                number: $("#num-dice").val(),
                type: $("#dice-type").val(),
                result: $("#dice-result").html(),
                result_breakdown: $(".result-breakdown").html()
            },
            counters: []
        };
        $("#counters").children().each((i, counter) => {
            obj.counters.push({
                name: $(counter).children().filter(".counter-label").val(),
                value: $(counter).children().filter(".counter-number").val()
            });
        });
        ipcRenderer.send("save", JSON.stringify(obj, null, 2));
    });

    $("#load-button").click(() => {
        ipcRenderer.send("load");
    });

    ipcRenderer.on("loaded", (event, arg) => {
        for(let i = 0; i < num_counters; i++){
            remove_counter(i);
        }
        num_counters = 0;
        let obj = JSON.parse(arg);
        let i = 0;
        obj.counters.forEach((counter) => {
            add_counter(i, counter);
            i++;
        });
        num_counters = i;
    });
});

function add_counter(index, counter = null){
    let counter_div = $("<div class='counter-div' id='counter-div-" + index + "'></div>");
    let counter_label = $("<input type='text' class='counter-label'>");
    let counter_number = $("<input type='number' class='counter-number' id='counter-" + index + "' >");
    let remove_button = $("<button type='button' class='remove-button' id='remove-counter-" + index + "'>Remove</button>");
    remove_button.click(function(){
        remove_counter(index);
    });
    counter_div.append(counter_label);
    counter_div.append(counter_number);
    counter_div.append(remove_button);
    $("#counters").append(counter_div);
    if(counter !== null){
        counter_label.val(counter.name);
        counter_number.val(counter.value);
    }
}

function remove_counter(index){
    $("#counter-div-" + index).remove();
}
