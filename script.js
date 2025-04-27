document.getElementById('attackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obținem datele din formular
    const target = document.getElementById('target').value;
    const arriveAt = document.getElementById('arriveAt').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const attacker = document.getElementById('attacker').value;
    const units = document.getElementById('units').value;

    let resultMessage = `🪓 Atac planificat împotriva satului [village]${target}[/village] (ajunge la [b]${arriveAt}[/b])\n\n`;
    resultMessage += `📅 Timp de lansare: [b]${startTime}[/b] → [b]${endTime}[/b]\n\n`;
    resultMessage += `🚀 Lansări:\n`;

    // Simulăm unități
    const unitsList = units.split('\n');
    unitsList.forEach(unit => {
        resultMessage += `➡️ Lansat de [player]${attacker}[/player] [b]${unit}[/b] la [i]${startTime}[/i]\n`;
    });

    document.getElementById('result').innerHTML = convertBBCodeToHTML(resultMessage);
});

// Funcție pentru convertirea BB Code în HTML
function convertBBCodeToHTML(text) {
    return text
        .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\[player\](.*?)\[\/player\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\[village\](.*?)\[\/village\]/g, '<span style="color:#8B5E3C;">$1</span>')
        .replace(/\n/g, '<br>');
}
