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
        teamDiv.innerHTML = `<h3>Equipo ${index + 1}</h3><p>${team.join(', ')}</p>`;
        teamsDiv.appendChild(teamDiv);
    });

    resultDiv.classList.remove('hidden');
}
