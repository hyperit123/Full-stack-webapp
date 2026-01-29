/**
 * Jack Knife Character Sheet Logic
 * Handles state management, UI updates, and persistence.
 */

// --- Global State & Elements ---
const state = {
    isEditing: false,
    organicRace: true,
    basePoints: 9,
    woundsCount: 2,
    staminaCount: 1
};

// UI Element Mappings
const elements = {
    // Displays
    chn: document.getElementById('chn'),
    gender: document.getElementById('gender'),
    race: document.getElementById('race'),
    class: document.getElementById('class'),
    level: document.getElementById('level-value'),
    status: document.getElementById('status-display'),
    speed: document.getElementById('speed'),
    pfp: document.getElementById('pfp'),
    background: document.getElementById('background'),
    dashAction: document.getElementById('dash-action'),
    
    // Stats Displays
    statsDisp: {
        ws: document.getElementById('ws-display'),
        bs: document.getElementById('bs-display'),
        tn: document.getElementById('tn-display'),
        str: document.getElementById('str-display'),
        dex: document.getElementById('dex-display'),
        int: document.getElementById('int-display'),
        per: document.getElementById('per-display'),
        wp: document.getElementById('wp-display'),
        fel: document.getElementById('fel-display')
    },

    // Edit Inputs
    edit: {
        chn: document.getElementById('chn-edit'),
        gender: document.getElementById('gender-edit'),
        race: document.getElementById('race-edit'),
        class: document.getElementById('class-edit'),
        speed: document.getElementById('speed-edit'),
        background: document.getElementById('background-edit'),
        status: document.getElementById('status'),
        level: document.getElementById('level-change'),
        extraPoints: document.getElementById('Exstra-points'),
        pointsRem: document.getElementById('points-remaining'),
        woundsMod: document.getElementById('wounds-mod'),
        staminaMod: document.getElementById('stamina-mod'),
        // Stat Inputs
        ws: document.getElementById('ws'),
        bs: document.getElementById('bs'),
        tn: document.getElementById('tn'),
        str: document.getElementById('str'),
        dex: document.getElementById('dex'),
        int: document.getElementById('int'),
        per: document.getElementById('per'),
        wp: document.getElementById('wp'),
        fel: document.getElementById('fel')
    },

    // Containers & Modals
    overlay: document.getElementById('overly'),
    woundsCont: document.querySelector('#wounds .check-boxs'),
    staminaCont: document.querySelector('#stamina .check-boxs'),
    
    // Buttons
    editBtn: document.getElementById('edit-btn'),
    closeBtn: document.getElementById('close-btn'),
    saveBtn: document.getElementById('save-btn'),
    loadBtn: document.getElementById('load-btn'),
    loadFile: document.getElementById('load-file'),
    pfpBtn: document.getElementById('pfp-btn'),
    pfpInput: document.getElementById('pfp-file')
};

// --- Initialization ---
window.onload = async () => {
    setupTabs();
    setupEventListeners();
    updatePointsRemaining();
    renderCheckboxes();
    syncEditToDisplay();
    // Display the currently logged-in user
    displayLoggedInUser();
    // Automatically load character data from the server on page load
    await loadCharacterFromServer(true);
};

// --- UI Logic ---

function setupTabs() {
    const tabs = ['statsTab', 'actionsTab', 'traitsTab', 'inventoryTab', 'statusEffectsTab', 'notesTab'];
    const contents = ['left-side', 'Actions', 'Traits', 'Inventory', 'StatusEffects', 'Notes'];

    tabs.forEach((tabId, index) => {
        const tabEl = document.getElementById(tabId);
        if (!tabEl) return;

        tabEl.addEventListener('click', () => {
            tabs.forEach(t => {
                const el = document.getElementById(t);
                if (el) el.classList.remove('active');
            });
            contents.forEach(c => {
                const el = document.getElementById(c);
                if (el) el.classList.remove('active');
            });
            
            tabEl.classList.add('active');
            const contentEl = document.getElementById(contents[index]);
            if (contentEl) contentEl.classList.add('active');
        });
    });
}

function setupEventListeners() {
    // Modal Toggle
    elements.editBtn.addEventListener('click', () => elements.overlay.style.display = 'flex');
    elements.closeBtn.addEventListener('click', () => {
        elements.overlay.style.display = 'none';
        syncEditToDisplay();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.overlay.style.display === 'flex') {
            elements.overlay.style.display = 'none';
            syncEditToDisplay();
        }
    });

    // Stat Point Calculation
    const statInputs = [
        elements.edit.ws, elements.edit.bs, elements.edit.tn, 
        elements.edit.str, elements.edit.dex, elements.edit.int, 
        elements.edit.per, elements.edit.wp, elements.edit.fel,
        elements.edit.extraPoints,
        elements.edit.level
    ];
    statInputs.forEach(input => input.addEventListener('input', updatePointsRemaining));
    elements.edit.tn.addEventListener('input', renderCheckboxes);
    elements.edit.dex.addEventListener('input', renderCheckboxes);
    document.getElementById('add-check-box').addEventListener('click', () => addCustomTracker());

    // Live Update Listeners
    const liveInputs = [
        elements.edit.chn, elements.edit.gender, elements.edit.race,
        elements.edit.class, elements.edit.level, elements.edit.status,
        elements.edit.speed, elements.edit.background,
        elements.edit.ws, elements.edit.bs, elements.edit.tn,
        elements.edit.str, elements.edit.dex, elements.edit.int,
        elements.edit.per, elements.edit.wp, elements.edit.fel
    ];
    liveInputs.forEach(input => input.addEventListener('input', syncEditToDisplay));

    // Dynamic Checkbox Counts
    elements.edit.woundsMod.addEventListener('input', renderCheckboxes);
    elements.edit.staminaMod.addEventListener('input', renderCheckboxes);

    // Status to Credits Logic
    elements.edit.status.addEventListener('change', (e) => {
        const creditsInput = document.getElementById('credits');
        const val = e.target.value;
        if (val === 'Wealthy') creditsInput.value = 1000;
        else if (val === 'Middle') creditsInput.value = 500;
        else if (val === 'Poor') creditsInput.value = 50;
        else if (val === 'Destitute') creditsInput.value = 0;
    });

    // Profile Picture Logic
    elements.pfpBtn.addEventListener('click', () => elements.pfpInput.click());
    elements.pfpInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type is JPEG
            if (file.type !== 'image/jpeg') {
                alert('Please upload a JPEG or JPG image.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                elements.pfp.src = event.target.result;
                document.getElementById('pfp-viewer').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save/Load
    elements.saveBtn.addEventListener('click', saveCharacter);
    elements.loadBtn.addEventListener('click', loadCharacterFromServer);
    elements.loadFile.addEventListener('change', loadCharacterFromFile);

    // Add list items (Actions, Traits, etc)
    setupListAdders();
}

function updatePointsRemaining() {
    // Calculate total value of all stats (defaulting to 1 if empty/invalid)
    const totalStats = 
        (parseInt(elements.edit.ws.value) || 1) + (parseInt(elements.edit.bs.value) || 1) +
        (parseInt(elements.edit.tn.value) || 1) + (parseInt(elements.edit.str.value) || 1) +
        (parseInt(elements.edit.dex.value) || 1) + (parseInt(elements.edit.int.value) || 1) +
        (parseInt(elements.edit.per.value) || 1) + (parseInt(elements.edit.wp.value) || 1) +
        (parseInt(elements.edit.fel.value) || 1);
    
    // Cost is value - 1 (since base is 1). Total cost = sum(values) - 9.
    const spentPoints = totalStats - 9;

    const extra = parseInt(elements.edit.extraPoints.value) || 0;
    const level = parseInt(elements.edit.level.value) || 1;
    
    // 9 base points + 1 per level above 1 + extra points
    const available = state.basePoints + (level - 1) + extra;
    const remaining = available - spentPoints;
    
    elements.edit.pointsRem.value = remaining;
    elements.edit.pointsRem.style.color = remaining < 0 ? 'red' : 'white';
}

function renderCheckboxes() {
    const wMod = parseInt(elements.edit.woundsMod.value) || 0;
    const sMod = parseInt(elements.edit.staminaMod.value) || 0;
    const tn = parseInt(elements.edit.tn.value) || 1;
    const dex = parseInt(elements.edit.dex.value) || 1;

    // Preserve currently checked boxes
    const currentW = elements.woundsCont.querySelectorAll('input:checked').length;
    const currentS = elements.staminaCont.querySelectorAll('input:checked').length;

    const wCount = wMod * tn;
    const sCount = sMod * dex;

    elements.woundsCont.innerHTML = '';
    elements.staminaCont.innerHTML = '';

    for(let i=0; i<wCount; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        if (i < currentW) cb.checked = true;
        elements.woundsCont.appendChild(cb);
    }
    
    for(let i=0; i<sCount; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        if (i < currentS) cb.checked = true;
        elements.staminaCont.appendChild(cb);
    }
}

function syncEditToDisplay() {
    // Header Info
    elements.chn.value = elements.edit.chn.value;
    elements.gender.value = elements.edit.gender.value;
    elements.race.value = elements.edit.race.value;
    elements.class.value = elements.edit.class.value;
    elements.level.value = elements.edit.level.value;
    elements.status.value = elements.edit.status.value;
    elements.speed.value = elements.edit.speed.value;
    elements.background.value = elements.edit.background.value;

    // Update Dash Action
    const speedVal = parseInt(elements.edit.speed.value) || 0;
    if (elements.dashAction) {
        elements.dashAction.textContent = `Dash [Move ${speedVal * 2} tiles] (1 stamina)`;
    }

    // Stats
    for (const key in elements.statsDisp) {
        elements.statsDisp[key].value = elements.edit[key].value;
    }

    // Handle Organic vs Mechanical styling
    const selectedRace = elements.edit.race.options[elements.edit.race.selectedIndex];
    const isOrganic = selectedRace.getAttribute('data-organic') === "true";
    document.querySelectorAll('.organic').forEach(el => el.style.display = isOrganic ? 'block' : 'none');
    document.querySelectorAll('.mech').forEach(el => el.style.display = isOrganic ? 'none' : 'block');
}

// --- List Management ---

function updateStatusEffectsDisplay() {
    const container = document.getElementById('status-effects-container');
    const list = document.getElementById('status-effects-header-list');
    list.innerHTML = '';
    
    container.querySelectorAll('textarea').forEach(textarea => {
        if (textarea.value.trim()) {
            const item = document.createElement('div');
            item.textContent = textarea.value;
            list.appendChild(item);
        }
    });
}

function addListItem(containerId, text = '', width = null, height = null) {
    const container = document.getElementById(containerId);
    const newItem = document.createElement('div');
    newItem.className = 'list-item-row';
    newItem.innerHTML = `
        <textarea placeholder="New entry...">${text}</textarea>
        <button class="del-btn">×</button>
    `;
    
    const textarea = newItem.querySelector('textarea');
    if (width) textarea.style.width = width;
    if (height) textarea.style.height = height;
    
    // Add listener for status effects to update header immediately
    if (containerId === 'status-effects-container') {
        textarea.addEventListener('input', updateStatusEffectsDisplay);
    }

    newItem.querySelector('.del-btn').onclick = () => {
        newItem.remove();
        if (containerId === 'status-effects-container') updateStatusEffectsDisplay();
    };
    
    container.appendChild(newItem);
    if (containerId === 'status-effects-container') updateStatusEffectsDisplay();
}

function setupListAdders() {
    const listMap = {
        'add-action-button': 'actions-container',
        'add-bonus-action-button': 'bonus-actions-container',
        'add-other-button': 'other-container',
        'add-trait-button': 'traits-container',
        'add-resistences-button': 'resistances-container',
        'add-immunities-button': 'immunities-container',
        'add-weaknesses-button': 'weaknesses-container',
        'add-inventory-button': 'inventory-container',
        'add-status-effects-button': 'status-effects-container',
        'add-notes-button': 'notes-container'
    };

    Object.entries(listMap).forEach(([btnId, contId]) => {
        document.getElementById(btnId).addEventListener('click', () => addListItem(contId));
    });
}

function addCustomTracker(name = 'New Tracker', max = 1, current = 0) {
    const container = document.getElementById('check-boxs');
    const div = document.createElement('div');
    div.className = 'check-boxs-container custom-tracker';
    
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.gap = '5px';
    header.style.marginBottom = '5px';
    header.style.alignItems = 'center';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = name;
    nameInput.className = 'tracker-name';
    nameInput.placeholder = "Name";
    nameInput.style.width = '200px';    

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.value = max;
    maxInput.className = 'tracker-max';
    maxInput.min = 1;
    maxInput.style.width = '48px';
    maxInput.style.textAlign = 'start';

    const delBtn = document.createElement('button');
    delBtn.textContent = 'DELETE';
    delBtn.className = 'del-btn';
    delBtn.style.height = '25px';
    delBtn.onclick = () => div.remove();

    header.appendChild(nameInput);
    header.appendChild(maxInput);
    header.appendChild(delBtn);

    const boxesDiv = document.createElement('div');
    boxesDiv.className = 'check-boxs';

    const render = (preserve = false) => {
        const count = parseInt(maxInput.value) || 0;
        const currentChecked = preserve ? boxesDiv.querySelectorAll('input:checked').length : current;
        
        boxesDiv.innerHTML = '';
        for(let i=0; i<count; i++) {
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            if (i < currentChecked) cb.checked = true;
            boxesDiv.appendChild(cb);
        }
        if (!preserve) current = 0; 
    };

    maxInput.addEventListener('input', () => render(true));

    div.appendChild(header);
    div.appendChild(boxesDiv);
    container.appendChild(div);
    
    render(false);
}

async function displayLoggedInUser() {
    const usernameDisplay = document.getElementById('username-display');
    if (!usernameDisplay) return;

    try {
        const res = await fetch('/whoami');
        if (res.ok) {
            const { username } = await res.json();
            usernameDisplay.textContent = username || 'Guest';
        } else {
            usernameDisplay.textContent = 'Guest';
        }
    } catch (error) {
        console.error('Error fetching user status:', error);
        usernameDisplay.textContent = 'N/A';
    }
}

// --- Data Persistence ---

async function saveCharacter() {
    // Helper to get values from textareas in a container
    const getListValues = (id) => {
        const container = document.getElementById(id);
        return Array.from(container.querySelectorAll('textarea')).map(t => ({
            text: t.value,
            width: t.style.width,
            height: t.style.height
        }));
    };

    const characterData = {
        header: {
            name: elements.edit.chn.value,
            gender: elements.edit.gender.value,
            race: elements.edit.race.value,
            class: elements.edit.class.value,
            level: elements.edit.level.value,
            status: elements.edit.status.value,
            speed: elements.edit.speed.value,
            background: elements.edit.background.value,
            credits: document.getElementById('credits').value,
            doch: document.getElementById('doch').value,
            renown: document.getElementById('renown').value
        },
        stats: {
            ws: elements.edit.ws.value,
            bs: elements.edit.bs.value,
            tn: elements.edit.tn.value,
            str: elements.edit.str.value,
            dex: elements.edit.dex.value,
            int: elements.edit.int.value,
            per: elements.edit.per.value,
            wp: elements.edit.wp.value,
            fel: elements.edit.fel.value,
            extra: elements.edit.extraPoints.value
        },
        mods: {
            wounds: elements.edit.woundsMod.value,
            stamina: elements.edit.staminaMod.value
        },
        statusState: {
            wounds: document.querySelectorAll('#wounds input:checked').length,
            stamina: document.querySelectorAll('#stamina input:checked').length
        },
        customTrackers: Array.from(document.querySelectorAll('.custom-tracker')).map(el => ({
            name: el.querySelector('.tracker-name').value,
            max: parseInt(el.querySelector('.tracker-max').value) || 0,
            current: el.querySelectorAll('input:checked').length
        })),
        appearance: {
            pfp: elements.pfp.src
        },
        lists: {
            actions: getListValues('actions-container'),
            bonusActions: getListValues('bonus-actions-container'),
            other: getListValues('other-container'),
            traits: getListValues('traits-container'),
            resistances: getListValues('resistances-container'),
            immunities: getListValues('immunities-container'),
            weaknesses: getListValues('weaknesses-container'),
            inventory: getListValues('inventory-container'),
            statusEffects: getListValues('status-effects-container'),
            notes: getListValues('notes-container')
        }
    };

    try {
        const res = await fetch('/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: characterData })
        });
        const result = await res.json();
        if (result.success) {
            alert('Character saved successfully!');
        } else {
            alert('Failed to save character.');
        }
    } catch (error) {
        console.error('Error saving character:', error);
        alert('An error occurred while saving.');
    }
}

function populateSheet(data) {
    if (!data) return;

    // Populate Header
    if (data.header) {
        elements.edit.chn.value = data.header.name || '';
        elements.edit.gender.value = data.header.gender || 'Other';
        elements.edit.race.value = data.header.race || 'Human';
        elements.edit.class.value = data.header.class || '';
        elements.edit.level.value = data.header.level || 1;
        elements.edit.status.value = data.header.status || 'Middle';
        elements.edit.speed.value = data.header.speed || 6;
        elements.edit.background.value = data.header.background || '';
        document.getElementById('credits').value = data.header.credits || 0;
        document.getElementById('doch').value = data.header.doch || 0;
        document.getElementById('renown').value = data.header.renown || 0;
    }

    // Populate Stats
    if (data.stats) {
        Object.entries(data.stats).forEach(([key, val]) => {
            if (elements.edit[key]) elements.edit[key].value = val;
        });
        elements.edit.extraPoints.value = data.stats.extra || 0;
    }

    // Populate Mods
    if (data.mods) {
        elements.edit.woundsMod.value = data.mods.wounds || 2;
        elements.edit.staminaMod.value = data.mods.stamina || 1;
    }

    // Render standard checkboxes
    renderCheckboxes();

    // Restore checked state for standard checkboxes
    if (data.statusState) {
        const wBoxes = document.querySelectorAll('#wounds input');
        for (let i = 0; i < data.statusState.wounds && i < wBoxes.length; i++) wBoxes[i].checked = true;

        const sBoxes = document.querySelectorAll('#stamina input');
        for (let i = 0; i < data.statusState.stamina && i < sBoxes.length; i++) sBoxes[i].checked = true;
    }

    // Restore Custom Trackers
    document.querySelectorAll('.custom-tracker').forEach(el => el.remove());
    if (data.customTrackers) {
        data.customTrackers.forEach(t => addCustomTracker(t.name, t.max, t.current));
    }

    // Appearance
    if (data.appearance && data.appearance.pfp) {
        elements.pfp.src = data.appearance.pfp;
        document.getElementById('pfp-viewer').src = data.appearance.pfp;
    }

    // Populate Lists
    const listContainers = {
        actions: 'actions-container',
        bonusActions: 'bonus-actions-container',
        other: 'other-container',
        traits: 'traits-container',
        resistances: 'resistances-container',
        immunities: 'immunities-container',
        weaknesses: 'weaknesses-container',
        inventory: 'inventory-container',
        statusEffects: 'status-effects-container',
        notes: 'notes-container'
    };

    if (data.lists) {
        Object.entries(listContainers).forEach(([key, containerId]) => {
            const container = document.getElementById(containerId);
            container.querySelectorAll('.list-item-row').forEach(el => el.remove());

            if (data.lists[key]) {
                data.lists[key].forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        addListItem(containerId, item.text, item.width, item.height);
                    } else {
                        addListItem(containerId, item);
                    }
                });
            }
        });
    }

    // Refresh UI
    updatePointsRemaining();
    syncEditToDisplay();
}

async function loadCharacterFromServer(isAutoLoad = false) {
    try {
        const res = await fetch('/data');
        if (!res.ok) {
            if (res.status === 401 && !isAutoLoad) {
                alert("You are not logged in. Please log in to load your character.");
                window.location.href = '/'; // redirect to login
            } else if (res.status !== 401) {
                throw new Error(`Server responded with status: ${res.status}`);
            }
            return;
        }
        const body = await res.json();
        if (body.data && Object.keys(body.data).length > 0) {
            populateSheet(body.data);
            if (!isAutoLoad) alert('Character loaded from server.');
        } else if (!isAutoLoad) {
            alert('No character data found on server.');
        }
    } catch (err) {
        console.error('Failed to load character from server:', err);
        if (!isAutoLoad) alert('Error loading character from server.');
    }
}

function loadCharacterFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            populateSheet(data);
        } catch (err) {
            console.error("Failed to parse character file", err);
            alert("Could not load character from file. It might be corrupted.");
        }
    };
    reader.readAsText(file);
}