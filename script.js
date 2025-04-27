// Preluarea datelor despre sate din URL
const villageDataUrl = "https://ro108.triburile.ro/map/village.txt";
let villageData = {};

fetch(villageDataUrl)
    .then(response => response.text())
    .then(data => {
        villageData = parseVillageData(data);
    })
    .catch(error => console.error("Eroare la încărcarea datelor despre sate:", error));

document.getElementById('attackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obținem datele din formular
    const attacker = document.getElementById('attacker').value;
    const attackerCoords = document.getElementById('attackerCoords').value.split('|');
    const targetCoords = document.getElementById('targetCoords').value.split('|');
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const units = document.getElementById('units').value;

    // Verificăm dacă datele coordonatelor sunt corecte
    if (attackerCoords.length !== 2 || targetCoords.length !== 2) {
        alert("Coordonatele trebuie să fie de forma: x|y (ex: 123|456)");
        return;
    }

    const targetVillage = getVillageByCoords(targetCoords[0], targetCoords[1]);

    let resultMessage = `🪓 Atac planificat împotriva satului [village]${targetVillage.name}[/village] (ajunge la [b]${endTime}[/b])\n\n`;
    resultMessage += `📅 Timp de lansare: [b]${startTime}[/b] → [b]${endTime}[/b]\n\n`;
    resultMessage += `🚀 Lansări:\n`;

    const unitsList = units.split('\n');
    unitsList.forEach(unit => {
        resultMessage += `➡️ Lansat de [player]${attacker}[/player] [b]${unit}[/b] de la coordonatele [i]${attackerCoords.join('|')}[/i] către [i]${targetCoords.join('|')}[/i]\n`;
    });

    document.getElementById('result').innerHTML = convertBBCodeToHTML(resultMessage);
});

// Funcție pentru a parsa datele din fișierul de sate
function parseVillageData(data) {
    const villages = {};
    const lines = data.split("\n");
    lines.forEach(line => {
        const parts = line.split("\t");
        if (parts.length === 3) {
            villages[`${parts[0]}|${parts[1]}`] = { name: parts[2] };
        }
    });
    return villages;
}

// Funcție pentru a obține satul după coordonate
function getVillageByCoords(x, y) {
    const coords = `${x}|${y}`;
    return villageData[coords] || { name: "Sat necunoscut" };
}

// Funcție pentru convertirea BBCode în HTML
function convertBBCodeToHTML(text) {
    return text
        .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\[player\](.*?)\[\/player\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\[village\](.*?)\[\/village\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\n/g, '<br>');
}
