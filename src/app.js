"use strict";
let input, output;
let inputUnit, outputUnit;
let impToMet = true;
let historyLength = 0;
let metricScale = {};
metricScale["Millimeter"] = 0.001;
metricScale["Centimeter"] = 0.01;
metricScale["Meter"] = 1;
metricScale["Kilometer"] = 1000;
let imperialScale = {};
imperialScale["Inch"] = 1;
imperialScale["Foot"] = 12;
imperialScale["Yard"] = 36;
imperialScale["Mile"] = 63360;
function get(id) {
    return document.getElementById(id);
}
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    let formattedHours = hours > 12 ? hours - 12 : hours;
    if (formattedHours === 0) {
        formattedHours = 12;
    }
    return `${formattedHours}:${minutes}${period}`;
}
function convert(switched) {
    input = parseInt(get("input").value);
    inputUnit = get("input-selector").value;
    outputUnit = get("output-selector").value;
    if (switched && (isNaN(input) || inputUnit.charAt(0) == 'S' || outputUnit.charAt(0) == 'S')) {
        return;
    }
    if (isNaN(input) || inputUnit.charAt(0) == 'S' || outputUnit.charAt(0) == 'S') {
        alert("Please enter valid values");
        return;
    }
    if (impToMet) {
        let inches = input * imperialScale[inputUnit];
        output = inches * 0.0254 * (1 / metricScale[outputUnit]);
    }
    else {
        let meters = input * metricScale[inputUnit];
        output = meters * 39.3701 * (1 / imperialScale[outputUnit]);
    }
    get("output").innerHTML = output.toPrecision(4);
    const now = new Date();
    let line = [`${input} ${inputUnit.toLowerCase()} = ${output.toPrecision(4)} ${outputUnit.toLowerCase()}`, `${getCurrentTime().toLowerCase()}`];
    const parent = get("history-output");
    const newDiv = document.createElement('div');
    newDiv.className = 'history-line';
    const newP = document.createElement('p');
    newP.textContent = line[0];
    const newTime = document.createElement('p');
    newTime.textContent = line[1];
    newTime.className = 'time';
    newDiv.appendChild(newP);
    newDiv.appendChild(newTime);
    parent.insertBefore(newDiv, parent.firstChild);
    historyLength++;
    if (historyLength > 0)
        get("history-output").classList.add("border", "border-secondary", "rounded");
}
function select(old, newSelector) {
    for (let i = 0; i < newSelector.options.length; i++) {
        if (newSelector.options[i].value === old.value) {
            newSelector.options[i].selected = true;
            break;
        }
    }
}
const convertButton = get("convert-button");
let outputSelector = get("output-selector");
let inputSelector = get("input-selector");
const switchButton = get("switch-button");
function addSelectListeners() {
    outputSelector.addEventListener("change", () => {
        get("output").innerHTML = "";
    });
    inputSelector.addEventListener("change", () => {
        get("output").innerHTML = "";
    });
}
convertButton.addEventListener("click", () => {
    convert(false);
});
addSelectListeners();
switchButton.addEventListener("click", () => {
    // make sure to change ids
    const inputParent = get("input-container");
    const outputParent = get("output-container");
    const input = get("input-selector");
    const output = get("output-selector");
    inputParent.removeChild(input);
    const newInput = output.cloneNode(true);
    newInput.id = "input-selector";
    select(output, newInput);
    inputParent.appendChild(newInput);
    inputSelector = get("input-selector");
    outputParent.removeChild(output);
    input.id = "output-selector";
    outputParent.appendChild(input);
    outputSelector = get("output-selector");
    outputSelector.addEventListener("change", () => {
        get("output").innerHTML = "";
    });
    inputSelector.addEventListener("change", () => {
        get("output").innerHTML = "";
    });
    addSelectListeners();
    impToMet = !impToMet;
    convert(true);
});
