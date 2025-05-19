document.getElementById('generateButton').addEventListener('click', function() {
    const participantsInput = document.getElementById('participants').value;
    const teamCount = parseInt(document.getElementById('teamCount').value);
    const participantsPerTeam = parseInt(document.getElementById('participantsPerTeam').value);
    const teamTitle = document.getElementById('teamTitle').value;

    const participants = participantsInput.split('\n').filter(p => p.length > 0 && p.length <= 50);
    
    if (participants.length > 100) {
        alert('Máximo 100 participantes.');
        return;
    }

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
