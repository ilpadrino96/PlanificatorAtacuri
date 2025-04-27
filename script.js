// URL-ul fișierului player.txt
const playerDataUrl = "https://ro108.triburile.ro/map/player.txt";
let playersData = {};

// Preluăm datele despre atacatori și satele acestora
fetch(playerDataUrl)
    .then(response => response.text())
    .then(data => {
        playersData = parsePlayerData(data);
        populateAttackerDropdown();
    })
    .catch(error => console.error("Eroare la încărcarea datelor despre atacatori:", error));

// Funcție pentru a parsa datele din player.txt
function parsePlayerData(data) {
    const players = {};
    const lines = data.split("\n");
    lines.forEach(line => {
        const parts = line.split("\t");
        if (parts.length === 4) {
            const playerName = parts[0];
            const villageName = parts[1];
            const coords = parts[2];

            if (!players[playerName]) {
                players[playerName] = [];
            }
            players[playerName].push({ name: villageName, coords: coords });
        }
    });
    return players;
}

// Populăm dropdown-ul pentru atacator
function populateAttackerDropdown() {
    const attackerDropdown = document.getElementById("attacker");

    // Creăm opțiuni pentru fiecare atacator
    for (const playerName in playersData) {
        const option = document.createElement("option");
        option.value = playerName;
        option.textContent = playerName;
        attackerDropdown.appendChild(option);
    }

    // Adăugăm eveniment pentru schimbarea atacatorului
    attackerDropdown.addEventListener("change", function() {
        populateVillageDropdown(this.value);
    });
}

// Populăm dropdown-ul pentru satele atacatorului selectat
function populateVillageDropdown(attacker) {
    const villageDropdown = document.getElementById("attackerVillage");
    villageDropdown.innerHTML = "<option value=''>Alege satul</option>"; // Resetăm opțiunile

    if (attacker && playersData[attacker]) {
        playersData[attacker].forEach(village => {
            const option = document.createElement("option");
            option.value = village.coords;
            option.textContent = `${village.name} (${village.coords})`;
            villageDropdown.appendChild(option);
        });
    }
}

document.getElementById('attackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obținem datele din formular
    const attacker = document.getElementById('attacker').value;
    const attackerVillage = document.getElementById('attackerVillage').value;
    const targetCoords = document.getElementById('targetCoords').value.split('|');
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const units = document.getElementById('units').value;

    // Verificăm dacă datele coordonatelor sunt corecte
    if (targetCoords.length !== 2) {
        alert("Coordonatele trebuie să fie de forma: x|y (ex: 123|456)");
        return;
    }

    let resultMessage = `🪓 Atac planificat din satul [village]${attackerVillage}[/village] al atacatorului [player]${attacker}[/player] (ajunge la [b]${endTime}[/b])\n\n`;
    resultMessage += `📅 Timp de lansare: [b]${startTime}[/b] → [b]${endTime}[/b]\n\n`;
    resultMessage += `🚀 Lansări:\n`;

    const unitsList = units.split('\n');
    unitsList.forEach(unit => {
        resultMessage += `➡️ Lansat de [player]${attacker}[/player] [b]${unit}[/b] din satul [village]${attackerVillage}[/village] către [i]${targetCoords.join('|')}[/i]\n`;
    });

    document.getElementById('result').innerHTML = convertBBCodeToHTML(resultMessage);
});

// Funcție pentru convertirea BBCode în HTML
function convertBBCodeToHTML(text) {
    return text
        .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\[player\](.*?)\[\/player\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\[village\](.*?)\[\/village\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\n/g, '<br>');
}
