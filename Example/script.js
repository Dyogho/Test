document.getElementById('generateButton').addEventListener('click', function () {
    const participantsInput = document.getElementById('participants').value.trim();
    let participantsRaw = participantsInput.split('\n').map(p => p.trim()).filter(p => p !== '');

    if (participantsRaw.length > 100) {
        alert('Máximo 100 participantes permitidos.');
        return;
    }

    const invalidNames = participantsRaw.filter(p => p.length > 50);
    if (invalidNames.length > 0) {
        alert('Algunos nombres superan los 50 caracteres. Corrige:\n\n' + invalidNames.join('\n'));
        return;
    }

    // Numerar los participantes válidos
    const participants = participantsRaw.map((p, i) => `${i + 1}. ${p}`);

    const teamCount = parseInt(document.getElementById('teamCount').value);
    const participantsPerTeam = parseInt(document.getElementById('participantsPerTeam').value);
    const teamTitle = document.getElementById('teamTitle').value;

    if (teamCount <= 0 || participantsPerTeam <= 0) {
        alert('Por favor, selecciona la cantidad de equipos y participantes por equipo.');
        return;
    }

    const shuffledParticipants = shuffleArray(participants);
    const teams = createTeams(shuffledParticipants, teamCount, participantsPerTeam);

    displayResults(teams, teamTitle);

});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createTeams(participants, teamCount, participantsPerTeam) {
    const teams = [];
    for (let i = 0; i < teamCount; i++) {
        teams[i] = participants.slice(i * participantsPerTeam, (i + 1) * participantsPerTeam);
    }
    return teams;
}

function displayResults(teams, title) {
    const resultDiv = document.getElementById('result');
    const resultTitle = document.getElementById('resultTitle');
    const teamsDiv = document.getElementById('teams');

    resultTitle.textContent = title;
    teamsDiv.innerHTML = '';

    teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team';
        teamDiv.innerHTML = `<h3>Equipo ${index + 1}</h3><ul>${team.map(p => `<li>${p}</li>`).join('')}</ul>`;
        teamsDiv.appendChild(teamDiv);
    });

    resultDiv.classList.remove('hidden');
}

// 📸 Descargar JPG
function descargarJPG() {
    const equipos = document.querySelectorAll(".team");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 800;
    const lineHeight = 30;
    const padding = 20;
    const equipoSpacing = 50;
    const totalHeight = equipos.length * (lineHeight * 6 + equipoSpacing) + padding * 2;

    canvas.width = width;
    canvas.height = totalHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";

    let y = padding;

    equipos.forEach((equipo, index) => {
        const nombreEquipo = `Equipo ${index + 1}`;
        ctx.fillText(nombreEquipo, padding, y);
        y += lineHeight;

        const participantes = equipo.querySelectorAll("li");
        participantes.forEach((p) => {
            ctx.fillText(p.textContent, padding + 20, y);
            y += lineHeight;
        });

        y += equipoSpacing;
    });

    const enlace = document.createElement("a");
    enlace.download = "equipos.jpg";
    enlace.href = canvas.toDataURL("image/jpeg");
    enlace.click();
}

// 📋 Copiar al portapapeles (formato lista)
function copiarAlPortapapeles() {
    const equipos = document.querySelectorAll(".team");
    let texto = "";

    equipos.forEach((equipo, index) => {
        texto += `Equipo ${index + 1}:\n`;
        equipo.querySelectorAll("li").forEach(li => {
            texto += `- ${li.textContent}\n`;
        });
        texto += "\n";
    });

    navigator.clipboard.writeText(texto)
        .then(() => alert("¡Copiado al portapapeles!"))
        .catch(() => alert("Error al copiar"));
}

// 🧾 Copiar equipos en columnas
function copiarEquiposColumnas() {
    const equipos = document.querySelectorAll(".team");
    let columnas = [];

    equipos.forEach(equipo => {
        const participantes = Array.from(equipo.querySelectorAll("li")).map(li => li.textContent);
        columnas.push(participantes);
    });

    const maxLength = Math.max(...columnas.map(col => col.length));
    let resultado = "";

    for (let i = 0; i < maxLength; i++) {
        let fila = columnas.map(col => col[i] || "").join("\t");
        resultado += fila + "\n";
    }

    navigator.clipboard.writeText(resultado)
        .then(() => alert("¡Equipos copiados en columnas!"))
        .catch(() => alert("Error al copiar columnas"));
}
