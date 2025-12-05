// JavaScript Document

// Wounds input logic and checkbox generation
let numberOfWounds = document.querySelector(`.stat-edit #tn`); // changed to tn in the overly
let woundsmod = document.getElementById("wounds-mod"); // Wounds modifier in the overly
let woundsContainer = document.getElementById("wounds").getElementsByClassName("check-boxs")[0];

function updateWounds() {
    let desiredWounds = Math.max((parseInt(numberOfWounds.value) || 0) * parseInt(woundsmod.value), 2);
    woundsContainer.innerHTML = '';
    for (let i = 0; i < desiredWounds; i++) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        woundsContainer.appendChild(checkbox);
    }
}

numberOfWounds.addEventListener('input', function() {
    updateWounds();
});

woundsmod.addEventListener('input', function() {
    updateWounds();
});

// Stamina input logic and checkbox generation
let numberOfstamina = document.querySelector(`.stat-edit #dex`); // changed to dex in the overly
let staminamod = document.getElementById("stamina-mod"); // Stamina modifier in the overly
let staminaContainer = document.getElementById("stamina").getElementsByClassName("check-boxs")[0];

function updatestamina() {
    let desiredStamina = Math.max((parseInt(numberOfstamina.value) || 0) * parseInt(staminamod.value), 1);
    staminaContainer.innerHTML = '';
    for (let i = 0; i < desiredStamina; i++) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        staminaContainer.appendChild(checkbox);
    }
}

numberOfstamina.addEventListener('input', function() {
    updatestamina();
});

staminamod.addEventListener('input', function() {
    updatestamina();
});

// Tab grup actions
const actionsTab = document.getElementById('actionsTab');
const traitsTab = document.getElementById('traitsTab');
const inventoryTab = document.getElementById('inventoryTab');
const statusEffectsTab = document.getElementById('statusEffectsTab');
const notesTab = document.getElementById('notesTab');
const actions = document.getElementById('Actions');
const traits = document.getElementById('Traits');
const inventory = document.getElementById('Inventory');
const statusEffects = document.getElementById('StatusEffects');
const notes = document.getElementById('Notes');

const updateTabs = (activeTab) => {
    actions.classList.remove('active');
    traits.classList.remove('active');
    inventory.classList.remove('active');
    statusEffects.classList.remove('active');
    notes.classList.remove('active');
    actionsTab.classList.remove('active');
    traitsTab.classList.remove('active');
    inventoryTab.classList.remove('active');
    statusEffectsTab.classList.remove('active');
    notesTab.classList.remove('active');

    // Fix for StatusEffects casing
    let tabId = activeTab;
    let btnId = activeTab;
    if (tabId === 'StatusEffects') btnId = 'statusEffectsTab';
    else if (tabId === 'Notes') btnId = 'notesTab';
    else btnId = `${activeTab.toLowerCase()}Tab`;

    document.getElementById(tabId).classList.add('active');
    document.getElementById(btnId).classList.add('active');
};

actionsTab.addEventListener('click', () => updateTabs('Actions'));
traitsTab.addEventListener('click', () => updateTabs('Traits'));
inventoryTab.addEventListener('click', () => updateTabs('Inventory'));
statusEffectsTab.addEventListener('click', () => updateTabs('StatusEffects'));
notesTab.addEventListener('click', () => updateTabs('Notes'));

updateTabs('Actions'); // Set initial active tab

// Text Box Addition Logic
function addTabs(section) {
    let sectionContainer = document.getElementById(section.toLowerCase() + '-container');
    let boxIndex = (sectionContainer.getElementsByClassName('text-box').length).valueOf() + 1;
    let textBox = document.createElement('textarea');
    textBox.rows = 2;
    textBox.cols = 30;
    textBox.className = 'text-box';
    textBox.placeholder = `${section} ${boxIndex}`;
    textBox.id = `${section}-textbox-${boxIndex}`;

    // Restore size from localStorage if available
    const sizeKey = `textarea-size-${textBox.id}`;
    const savedSize = localStorage.getItem(sizeKey);
    if (savedSize) {
        try {
            const { width, height } = JSON.parse(savedSize);
            if (width) textBox.style.width = width + 'px';
            if (height) textBox.style.height = height + 'px';
        } catch (e) {}
    }

    // Save size on mouseup (after resize) and input
    function saveTextareaSize() {
        const width = textBox.offsetWidth;
        const height = textBox.offsetHeight;
        localStorage.setItem(sizeKey, JSON.stringify({ width, height }));
    }
    textBox.addEventListener('mouseup', saveTextareaSize);
    textBox.addEventListener('input', saveTextareaSize);

    // Create delete button
    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";

    // Wrap textarea + button together
    let wrapper = document.createElement('div');
    wrapper.className = "textbox-wrapper";
    wrapper.appendChild(textBox);
    wrapper.appendChild(deleteBtn);

        // Add delete functionality
        deleteBtn.addEventListener('click', () => {
            sectionContainer.removeChild(wrapper);
            // If this is the status effects section, update the header viewer
            if (sectionContainer.id === 'status-effects-container') {
                if (typeof updateStatusEffectsHeaderViewer === 'function') {
                    updateStatusEffectsHeaderViewer();
                }
            }
        });

    // Append wrapper to container
    sectionContainer.appendChild(wrapper);
}
// Actions Section
    let addActionButton = document.getElementById('add-action-button');
    addActionButton.addEventListener('click', () => {
        addTabs('actions');
    });
// bunus Actions Section
    let addBonusActionButton = document.getElementById('add-bonus-action-button');
    addBonusActionButton.addEventListener('click', () => {
        addTabs('bonus-actions');
    });
// Other Section
    let addOtherButton = document.getElementById('add-other-button');
    addOtherButton.addEventListener('click', () => {
        addTabs('other');
    });
// tarits Section
    let addTraitButton = document.getElementById('add-trait-button');
    addTraitButton.addEventListener('click', () => {
        addTabs('traits');
    });
// resistances Section
    let addResistencesButton = document.getElementById('add-resistences-button');
    addResistencesButton.addEventListener('click', () => {
        addTabs('resistances');
    });
// immunities Section
    let addImmunitiesButton = document.getElementById('add-immunities-button');
    addImmunitiesButton.addEventListener('click', () => {
        addTabs('immunities');
    });
// weaknesses Section
    let addWeaknessesButton = document.getElementById('add-weaknesses-button');
    addWeaknessesButton.addEventListener('click', () => {
        addTabs('weaknesses');
    });
// invertory Section
    let addInventoryButton = document.getElementById('add-inventory-button');
    addInventoryButton.addEventListener('click', () => {
        addTabs('inventory');
    });
// status effects Section
    let addStatusEffectsButton = document.getElementById('add-status-effects-button');
    addStatusEffectsButton.addEventListener('click', () => {
        addTabs('status-effects');
    });
// notes Section
    let addNotesButton = document.getElementById('add-notes-button');
    addNotesButton.addEventListener('click', () => {
        addTabs('notes');
    });

// overly edit menu logic
let editbtn = document.getElementById("edit-btn");
let overly = document.getElementById("overly");

// Speed sync logic
let speedEdit = document.getElementById("speed-edit");
let speedDisplay = document.getElementById("speed");
if (speedEdit && speedDisplay) {
    // Sync edit to display
    function updateSpeed() {
        speedDisplay.value = speedEdit.value;
    }
    speedEdit.addEventListener("input", updateSpeed);
    // Initial sync
    updateSpeed();
}

editbtn.addEventListener("click", function() {
    overly.style.display = "flex";
});

window.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        if (window.getComputedStyle(overly).display === "flex") {
            overly.style.display = "none";
        }
    }
});

// name edit logic
let chnEdit = document.getElementById("chn-edit");
let chn = document.getElementById("chn");

chnEdit.addEventListener("input", () => {
    updatechn();
});

function updatechn(){
    chn.value = chnEdit.value;
}

// gender edit logic
let genderEdit = document.getElementById("gender-edit");
let gender = document.getElementById("gender");

genderEdit.addEventListener("change", () => {
    updategender();
});
function updategender() {
    gender.value = genderEdit.value;
}

// race edit logic
let raceEdit = document.getElementById("race-edit");
let race = document.getElementById("race");
let corentrace = "false";
let raceOrganic = raceEdit.options[raceEdit.selectedIndex].dataset.organic === "true";
let organic = document.getElementsByClassName("organic");
let mech = document.getElementsByClassName("mech");
raceEdit.addEventListener("change", () => {
    updaterace();
});

function updaterace() {
    const opt = raceEdit.options[raceEdit.selectedIndex];

    // keep your original behavior
    race.value = raceEdit.value; 

     // read the tag
    const isOrganic = opt.dataset.organic === "true";

    // use it however you like
    corentrace = isOrganic ? "true" : "false" ; // or clanker says Victor
    race.dataset.organic = isOrganic; // optional: store on the input for later

    // show/hide elements based on race
    if (corentrace === "true") {
        showorganic();
    }
    if (corentrace === "false"){
        showmech();
    }
}

function showorganic(){
    for (let i = 0; i < organic.length; i++) {
        organic[i].style.display = "block";
    }
    for (let i = 0; i < mech.length; i++) {
        mech[i].style.display = "none";
    }
}

function showmech(){
    for (let i = 0; i < mech.length; i++) {
        mech[i].style.display = "block";
    }
    for (let i = 0; i < organic.length; i++) {
        organic[i].style.display = "none";
    }
}

// class edit logic
let classEdit = document.getElementById("class-edit");
let classField = document.getElementById("class");

classEdit.addEventListener("change", () => {
    updateclass();
});

function updateclass() {
    classField.value = classEdit.value;
}

// background edit logic
let backgroundEdit = document.getElementById("background-edit");
let background = document.getElementById("background");

backgroundEdit.addEventListener("change", () => {
    updatebackground();
});

function updatebackground() {
    background.value = backgroundEdit.value;
}

// stats
let stats = ['ws', 'bs', 'str', 'tn', 'dex', 'per', 'int', 'wp', 'fel'];
let basePoints = 9; // points at level 1

// Sync display (.stat) with editable (.stat-edit)
stats.forEach((stat) => {
    const currentStat     = document.querySelector(`.stat #${stat}`);
    const currentStatEdit = document.querySelector(`.stat-edit #${stat}`);

    if (!currentStat || !currentStatEdit) {
        console.warn(`Missing element for stat: ${stat}`);
        return;
    }

    // Start at 1 if empty or less than 1
    currentStat.value     = Math.max(1, parseInt(currentStat.value) || 1);
    currentStatEdit.value = Math.max(1, parseInt(currentStatEdit.value) || 1);

    // Keep them in sync while typing
    currentStatEdit.addEventListener("input", () => {
        currentStat.value = currentStatEdit.value;
        calculatePoints(); // recalc points on change
    });

    // Enforce minimum only when leaving the field
    currentStatEdit.addEventListener("blur", () => {
        let newValue = parseInt(currentStatEdit.value) || 1;
        if (newValue < 1) newValue = 1;
        currentStatEdit.value = newValue;
        currentStat.value = newValue;
        calculatePoints();
    });
});

// level functionality
let exstrapoints = 0;
const levelInput = document.querySelector("#level-change");
let point = document.getElementById('points-remaining');
let expoint = document.getElementById('Exstra-points');

expoint.addEventListener("input", () => {
    exstrapoints = parseInt(expoint.value) || 0;
    calculatePoints(); // recalc whenever extra points change
    
});

let warned = false;

function calculatePoints() {
    let spentPoints = 0;
    const level = parseInt(levelInput.value) || 1;
    let totalPoints = basePoints + (level - 1) + exstrapoints;
    exstrapoints = parseInt(expoint.value) || 0;

    stats.forEach(stat => {
        const input = document.querySelector(`.stat-edit #${stat}`);
        let value = parseInt(input.value) || 1;
        if (value < 1) value = 1;
        input.value = value;
        spentPoints += (value - 1);
    });

    const remaining = totalPoints - spentPoints;
    point.value = remaining;

    if (remaining < 0 && !warned) {
        alert("You have spent too many points!");
        warned = true; // prevent further alerts
    }
    if (remaining >= 0) {
        warned = false; // reset when valid again
    }
}


// Attach listeners for level changes
levelInput.addEventListener("input", calculatePoints);

// Initialize
calculatePoints();


// level changing
let currentlevel = document.getElementById('level-change')
let levelvalue = document.getElementById('level-value')
currentlevel.addEventListener("input", () => {
    levelload();
});
function levelload() {
    levelvalue.value = currentlevel.value
}

// Initial generation on page load
document.addEventListener("DOMContentLoaded", () => {
    pagereload();
    // Restore textarea sizes for all loaded textareas
    document.querySelectorAll('.text-box').forEach(textBox => {
        const sizeKey = `textarea-size-${textBox.id}`;
        const savedSize = localStorage.getItem(sizeKey);
        if (savedSize) {
            try {
                const { width, height } = JSON.parse(savedSize);
                if (width) textBox.style.width = width + 'px';
                if (height) textBox.style.height = height + 'px';
            } catch (e) {}
        }
    });
});

function safeCall(fn) {
    try {
        fn();
    } catch (e) {
        console.error("Error in function:", fn.name, e);
    }
}

// checkbox adding
let addcheckbox = document.getElementById("add-check-box");
let checkboxs = document.getElementById("check-boxs");
let totalcheckboxs = 0;

addcheckbox.addEventListener("click", function() {
    totalcheckboxs += 1;

    // Container for each "check-boxs"
    let chbc = document.createElement('div');
    chbc.className = "check-boxs-container";
    chbc.style = 'display: grid; grid-template-columns: 60% 20%; gap: 10px;'
    checkboxs.appendChild(chbc);

    // Label input
    let inputforchc = document.createElement('input');
    inputforchc.placeholder = `check box ${totalcheckboxs}`;
    inputforchc.className = 'check-box-exstras';
    chbc.appendChild(inputforchc);

    // Number input (to decide how many checkboxes to add)
    let inputval = document.createElement('input');
    inputval.type = 'number';
    inputval.value = 1;
    inputval.min = 1;
    inputval.max = 40;
    inputval.className = 'inputval';
    chbc.appendChild(inputval);

    // Div to hold the checkboxes
    let div = document.createElement('div');
    div.className = 'check-boxs';
    chbc.appendChild(div);

    // Delete button for this checkbox group
    let delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.style.gridColumn = 'span 2';
    delBtn.style.height = '30px';
    delBtn.style.width = '70px';
    delBtn.addEventListener('click', () => {
        chbc.remove();
    });
    chbc.appendChild(delBtn);

    // Function to update checkboxes based on inputval
    function updateexstra() {
        let desiredexstra = parseInt(inputval.value) || 0;
        div.innerHTML = ''; // clear old checkboxes
        for (let i = 0; i < desiredexstra; i++) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            div.appendChild(checkbox);
        }
    }
    updateexstra();

    // Update whenever the number input changes
    inputval.addEventListener('input', updateexstra);

    console.log("added check box container thing");
});

function getCharacterData() {
    let data = {};

    // Basic info
    data.name = document.getElementById("chn").value;
    data.gender = document.getElementById("gender").value;
    data.race = document.getElementById("race").value;
    data.class = document.getElementById("class").value;
    data.background = document.getElementById("background").value;
    data.level = document.getElementById("level-change").value;
    data.exstrapoints = document.getElementById("Exstra-points").value;
    // Save status
    const statusSel = document.getElementById('status');
    // Save speed
    data.speed = document.getElementById("speed-edit")?.value || "";
    data.status = statusSel ? statusSel.value : null;

    // Coin values
    data.coins = {
        credits: document.getElementById("credits").value,
        doch: document.getElementById("doch").value,
        renown: document.getElementById("renown").value
    };

    // Stats
    data.stats = {};
    ['ws','bs','str','tn','dex','per','int','wp','fel'].forEach(stat => {
        let val = document.querySelector(`.stat-edit #${stat}`).value;
        data.stats[stat] = val;
    });


    // --- Save wounds and stamina checkboxes state ---
    function getCheckboxStates(container) {
        return Array.from(container.querySelectorAll('input[type="checkbox"]')).map(cb => cb.checked);
    }
    // Wounds
    let woundsModEl = document.getElementById('wounds-mod');
    let woundsMod = woundsModEl ? parseInt(woundsModEl.value, 10) : 0;
    let woundsContainer = document.getElementById('wounds').getElementsByClassName('check-boxs')[0];
    data.woundsMod = woundsMod;
    data.woundsChecked = getCheckboxStates(woundsContainer);

    // Stamina
    let staminaModEl = document.getElementById('stamina-mod');
    let staminaMod = staminaModEl ? parseInt(staminaModEl.value, 10) : 1;
    let staminaContainer = document.getElementById('stamina').getElementsByClassName('check-boxs')[0];
    data.staminaMod = staminaMod;
    data.staminaChecked = getCheckboxStates(staminaContainer);


    // Dynamic text boxes (actions, traits, inventory, etc.)
    data.textboxes = {};
    document.querySelectorAll(".textbox-wrapper textarea").forEach(tb => {
        // Save value and size (rows, cols, inline width/height if set)
        data.textboxes[tb.id] = {
            value: tb.value,
            rows: tb.rows,
            cols: tb.cols,
            styleWidth: tb.style.width || null,
            styleHeight: tb.style.height || null
        };
    });

    // Extra checkboxes (save checked state)
    data.extraCheckboxes = [];
    document.querySelectorAll(".check-boxs-container").forEach(container => {
        if (container.id === 'wounds' || container.id === 'stamina') return;
        let numInput = container.querySelector(".inputval");
        let labelInput = container.querySelector(".check-box-exstras");
        let num = numInput ? numInput.value : null;
        let label = labelInput ? labelInput.value : null;
        let checked = Array.from(container.querySelectorAll('input[type="checkbox"]')).map(cb => cb.checked);
        if (num !== null && label !== null && num !== "" && label !== "") {
            data.extraCheckboxes.push({number: num, text: label, checked});
        }
    });

    // Profile picture (save as data URL if available)
    const pfpImg = document.getElementById('pfp');
    if (pfpImg) {
        // If the src is an object URL or file path, try to keep current value;
        // Prefer a data URL for portability when loading from JSON
        data.pfpDataUrl = pfpImg.dataset.pfpDataUrl || null;
        data.pfpSrc = (!data.pfpDataUrl ? pfpImg.src : null);
    }

    return data;
};

// Save button logic

document.getElementById("save-btn").addEventListener("click", () => {
    let snapshot = getCharacterData();
    console.log(snapshot); // Inspect in console

    // Convert snapshot to JSON string
    const dataStr = JSON.stringify(snapshot, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([dataStr], { type: "application/json" });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "characterData.json"; // File name
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});


// --- Status Effects Viewer Logic ---
function updateStatusEffectsHeaderViewer() {
    const list = document.getElementById('status-effects-header-list');
    if (!list) return;
    list.innerHTML = '';
    const container = document.getElementById('status-effects-container');
    if (!container) return;
    const effects = Array.from(container.querySelectorAll('textarea'))
        .map(tb => tb.value.trim())
        .filter(val => val.length > 0);
    if (effects.length === 0) {
        list.innerHTML = '<span style="color:#aaa;">No status effects</span>';
        return;
    }
    effects.forEach(effect => {
        const div = document.createElement('div');
        div.textContent = effect;
        list.appendChild(div);
    });
}

document.addEventListener('input', function(e) {
    if (e.target.closest('#status-effects-container')) {
        updateStatusEffectsHeaderViewer();
    }
});
if (typeof statusEffectsTab !== 'undefined') {
    statusEffectsTab.addEventListener('click', updateStatusEffectsHeaderViewer);
}
document.addEventListener('DOMContentLoaded', updateStatusEffectsHeaderViewer);

// Function to reload all dynamic elements


function pagereload() {
    safeCall(updateWounds);
    safeCall(updatestamina);
    safeCall(updategender);
    safeCall(updaterace);
    safeCall(updateclass);
    safeCall(updatebackground);
    safeCall(updatechn);
    safeCall(levelload);
    safeCall(calculatePoints);
    // Also update cash/status
    if (typeof updateCashAndSaveStatus === 'function') safeCall(updateCashAndSaveStatus);
    // Refresh speed display
    if (typeof speedEdit !== 'undefined' && typeof speedDisplay !== 'undefined') {
        if (speedEdit && speedDisplay) speedDisplay.value = speedEdit.value;
    }
}

// Add Dash bonus action to Bonus Actions tab
function addDashBonusAction() {
    const bonusActionsContainer = document.getElementById('bonus-actions-container');
    if (!bonusActionsContainer) return;
    // Remove old Dash if present
    const oldDash = bonusActionsContainer.querySelector('.dash-action');
    if (oldDash) oldDash.remove();
    // Get speed value
    let speedVal = parseInt(document.getElementById('speed').value) || 5;
    let dashStamina = 1;
    // Create Dash element
    const dash = document.createElement('p');
    dash.className = 'dash-action ';
    dash.textContent = `Dash [moves ${speedVal * 2} tiles, ${dashStamina} stamina] `;
    // Insert at top
    bonusActionsContainer.insertBefore(dash, bonusActionsContainer.firstChild);
}
// Update Dash action whenever speed changes
if (speedEdit) {
    speedEdit.addEventListener('input', addDashBonusAction);
}
document.addEventListener('DOMContentLoaded', addDashBonusAction);

// End of script.js
// --- Status cash setter ---
document.addEventListener('DOMContentLoaded', function() {
    const statusSel = document.getElementById('status');
    const setCashBtn = document.getElementById('set-cash-btn');
    const creditsField = document.getElementById('credits');
    if (statusSel && setCashBtn && creditsField) {
        setCashBtn.addEventListener('click', function() {
            let cashAmount = 0;
            switch (statusSel.value) {
                case 'Wealthy': cashAmount = 1000; break;
                case 'Middle': cashAmount = 500; break;
                case 'Poor': cashAmount = 50; break;
                case 'Destitute': cashAmount = 0; break;
                default: cashAmount = 0;
            }
            creditsField.value = cashAmount;
        });
    }
});
// --- Load from JSON and restore UI state ---
// --- Status cash setter ---
document.addEventListener('DOMContentLoaded', function() {
    const statusSel = document.getElementById('status');
    const creditsField = document.getElementById('credits');
    if (statusSel && creditsField) {
        function updateCashAndSaveStatus() {
            let cashAmount = 0;
            switch (statusSel.value) {
                case 'Wealthy': cashAmount = 1000; break;
                case 'Middle': cashAmount = 500; break;
                case 'Poor': cashAmount = 50; break;
                case 'Destitute': cashAmount = 0; break;
                default: cashAmount = 0;
            }
            creditsField.value = cashAmount;
        }
        statusSel.addEventListener('change', updateCashAndSaveStatus);
        // Set initial value on page load
        updateCashAndSaveStatus();
    }
});
function loadCharacterData(data) {
    // Basic info
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? el.value; };
    setVal("chn", data.name || "");
    setVal("gender", data.gender || "");
    setVal("race", data.race || "");
    setVal("class", data.class || "");
    setVal("background", data.background || "");
    setVal("level-change", data.level ?? 1);
    setVal("Exstra-points", data.exstrapoints ?? 0);
    // Restore speed
    setVal("speed-edit", data.speed ?? 5);
    setVal("speed", data.speed ?? 5);

    // Reflect editable overlay fields if they exist
    setVal("chn-edit", data.name || "");
    setVal("gender-edit", data.gender || "");
    setVal("race-edit", data.race || "");
    setVal("class-edit", data.class || "");
    setVal("background-edit", data.background || "");

    // Coins (optional block if you store them)
    if (data.coins) {
        setVal("credits", data.coins.credits);
        setVal("doch", data.coins.doch);
        setVal("renown", data.coins.renown);
    }
    // Restore status and update credits
    if (typeof data.status === 'string') {
        const statusSel = document.getElementById('status');
        if (statusSel) {
            statusSel.value = data.status;
            // Also update credits field to match status
            let cashAmount = 0;
            switch (data.status) {
                case 'Wealthy': cashAmount = 1000; break;
                case 'Middle': cashAmount = 500; break;
                case 'Poor': cashAmount = 50; break;
                case 'Destitute': cashAmount = 0; break;
                default: cashAmount = 0;
            }
        }
    }
        // Restore status
        if (typeof data.status === 'string') {
            const statusSel = document.getElementById('status');
            if (statusSel) statusSel.value = data.status;
        }

    // Stats on editable side drive the rest
    if (data.stats) {
        ['ws','bs','str','tn','dex','per','int','wp','fel'].forEach(stat => {
            const editEl = document.querySelector(`.stat-edit #${stat}`);
            const dispEl = document.querySelector(`.stat #${stat}`);
            if (editEl) editEl.value = data.stats[stat] ?? editEl.value;
            if (dispEl) dispEl.value = data.stats[stat] ?? dispEl.value;
        });
    }

    // Wounds/Stamina modifiers
    setVal("wounds-mod", data.woundsMod);
    setVal("stamina-mod", data.staminaMod);

    // Restore wounds/stamina checked state after regeneration
    setTimeout(() => {
        // Wounds
        if (Array.isArray(data.woundsChecked)) {
            let woundsContainer = document.getElementById('wounds').getElementsByClassName('check-boxs')[0];
            let cbs = woundsContainer.querySelectorAll('input[type="checkbox"]');
            data.woundsChecked.forEach((v, i) => { if (cbs[i]) cbs[i].checked = v; });
        }
        // Stamina
        if (Array.isArray(data.staminaChecked)) {
            let staminaContainer = document.getElementById('stamina').getElementsByClassName('check-boxs')[0];
            let cbs = staminaContainer.querySelectorAll('input[type="checkbox"]');
            data.staminaChecked.forEach((v, i) => { if (cbs[i]) cbs[i].checked = v; });
        }
    }, 0);

    // Recompute dependent UI using existing helpers
    safeCall(updateWounds);
    safeCall(updatestamina);
    safeCall(calculatePoints);
    safeCall(levelload);
    safeCall(updaterace);
    safeCall(updategender);
    safeCall(updateclass);
    safeCall(updatebackground);
    safeCall(updatechn);

    // Restore dynamic textboxes
    if (data.textboxes) {
        // Clear all current wrappers
        document.querySelectorAll(".textbox-wrapper").forEach(w => w.remove());

        Object.entries(data.textboxes).forEach(([id, payload]) => {
            const match = id.match(/^([a-z\-]+)-textbox-\d+$/i);
            if (!match) return;
            const section = match[1];
            const sectionContainer = document.getElementById(section.toLowerCase() + "-container");
            if (!sectionContainer) return;

            const textBox = document.createElement("textarea");
            textBox.rows = (payload && payload.rows) ? payload.rows : 2;
            textBox.cols = (payload && payload.cols) ? payload.cols : 30;
            textBox.className = "text-box";
            textBox.placeholder = id;
            textBox.id = id;
            textBox.value = (payload && payload.value) ? payload.value : "";

            // Restore size from loaded data
            if (payload && payload.styleWidth) textBox.style.width = payload.styleWidth;
            if (payload && payload.styleHeight) textBox.style.height = payload.styleHeight;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.className = "delete-btn";

            const wrapper = document.createElement("div");
            wrapper.className = "textbox-wrapper";
            wrapper.appendChild(textBox);
            wrapper.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", () => {
                sectionContainer.removeChild(wrapper);
                if (sectionContainer.id === 'status-effects-container') {
                    if (typeof updateStatusEffectsHeaderViewer === 'function') {
                        updateStatusEffectsHeaderViewer();
                    }
                }
            });

            sectionContainer.appendChild(wrapper);
        });
        if (typeof updateStatusEffectsHeaderViewer === 'function') {
            updateStatusEffectsHeaderViewer();
        }
    }

    // Restore extra checkbox groups
    if (Array.isArray(data.extraCheckboxes)) {
        const root = document.getElementById("check-boxs");
        if (root) {
            // Remove only dynamically added groups; keep base wounds/stamina
            root.querySelectorAll('.check-boxs-container').forEach(c => {
                if (c.id !== 'wounds' && c.id !== 'stamina') c.remove();
            });
            if (typeof totalcheckboxs !== "undefined") totalcheckboxs = 0;

            data.extraCheckboxes.forEach(({ number, text, checked }) => {
                if (typeof totalcheckboxs !== "undefined") totalcheckboxs += 1;

                const chbc = document.createElement("div");
                chbc.className = "check-boxs-container";
                chbc.style = "display: grid; grid-template-columns: 60% 20%; gap: 10px;";
                root.appendChild(chbc);

                const inputforchc = document.createElement("input");
                inputforchc.placeholder = `check box ${totalcheckboxs || 1}`;
                inputforchc.className = "check-box-exstras";
                inputforchc.value = text ?? "";
                chbc.appendChild(inputforchc);

                const inputval = document.createElement("input");
                inputval.type = "number";
                inputval.min = 1;
                inputval.max = 40;
                inputval.className = "inputval";
                inputval.value = (number ?? 1);
                chbc.appendChild(inputval);

                const div = document.createElement("div");
                div.className = "check-boxs";
                chbc.appendChild(div);

                // Add delete button for loaded checkbox group
                const delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.className = 'delete-btn';
                delBtn.style.gridColumn = 'span 2';
                delBtn.style.height = '30px';
                delBtn.style.width = '70px';
                delBtn.addEventListener('click', () => {
                    chbc.remove();
                });
                chbc.appendChild(delBtn);

                function updateexstra() {
                    const desired = parseInt(inputval.value) || 0;
                    div.innerHTML = "";
                    for (let i = 0; i < desired; i++) {
                        const checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        div.appendChild(checkbox);
                    }
                    // Restore checked state if available
                    if (Array.isArray(checked)) {
                        div.querySelectorAll('input[type="checkbox"]').forEach((cb, idx) => {
                            cb.checked = !!checked[idx];
                        });
                    }
                }
                updateexstra();
                inputval.addEventListener("input", updateexstra);
            });
        }
    }
// Utility: Count checked checkboxes in a container
function countCheckedCheckboxes(container) {
    return Array.from(container.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.checked).length;
}

    // Ensure tabs are consistent after load
    safeCall(() => updateTabs('Actions'));

    // Restore profile picture
    const pfpImg = document.getElementById('pfp');
    if (pfpImg) {
        if (data.pfpDataUrl) {
            pfpImg.src = data.pfpDataUrl;
            pfpImg.dataset.pfpDataUrl = data.pfpDataUrl;
        } else if (data.pfpSrc) {
            pfpImg.src = data.pfpSrc;
            delete pfpImg.dataset.pfpDataUrl;
        }
        const pfpViewer = document.getElementById('pfp-viewer');
        if (pfpViewer) {
            pfpViewer.src = pfpImg.src;
        }
    }
}

// Wire up a Load button + file input (if present)
(() => {
    const loadBtn = document.getElementById("load-btn");
    const loadFile = document.getElementById("load-file"); // <input type="file" accept="application/json">

    if (loadBtn && loadFile) {
        loadBtn.addEventListener("click", () => loadFile.click());
    }

    if (loadFile) {
        loadFile.addEventListener("change", async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                loadCharacterData(data);
                // Re-run initializers to reattach events and sync UI
                safeCall(pagereload);
            } catch (err) {
                console.error("Failed to load character JSON:", err);
                alert("Could not load JSON file. See console for details.");
            } finally {
                e.target.value = ""; // allow re-selecting the same file
            }
        });
    }
})();

// Profile picture loader (file input -> image + store data URL)
(() => {
    const pfpFile = document.getElementById('pfp-file');
    const pfpImg = document.getElementById('pfp');
    const pfpViewer = document.getElementById('pfp-viewer');
    const pfpBtn = document.getElementById('pfp-btn');

    if (pfpBtn && pfpFile) {
        pfpBtn.addEventListener('click', () => pfpFile.click());
    }

    if (pfpFile && pfpImg) {
        pfpFile.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result;
                    if (typeof dataUrl === 'string') {
                        pfpImg.src = dataUrl;
                        if (pfpViewer) pfpViewer.src = dataUrl;
                        pfpImg.dataset.pfpDataUrl = dataUrl; // keep data URL for saving
                    }
                };
                reader.readAsDataURL(file);
            } catch (err) {
                console.error('Failed to load profile picture:', err);
                alert('Could not load profile picture.');
            } finally {
                e.target.value = '';
            }
        });
    }
})();