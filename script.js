let gpaChart = null;

function generateInputs() {
    const numSemesters = parseInt(document.getElementById("numSemesters").value);
    if (isNaN(numSemesters) || numSemesters < 1 || numSemesters > 12) {
        alert("Please enter a valid number of semesters (1-12).");
        return;
    }

    const gpaInputs = document.getElementById("gpaInputs");
    gpaInputs.innerHTML = "";

    for (let i = 1; i <= numSemesters; i++) {
        const div = document.createElement("div");
        div.classList.add("input-group");

        const label = document.createElement("label");
        label.textContent = `Semester ${i} GPA:`;

        const input = document.createElement("input");
        input.type = "number";
        input.step = "0.01";
        input.min = "0";
        input.max = "5";
        input.id = `gpa${i}`;
        input.placeholder = "Enter GPA (0-5)";

        div.appendChild(label);
        div.appendChild(input);
        gpaInputs.appendChild(div);
    }
}

function generateChart(gpas) {
    const ctx = document.getElementById('gpaChart').getContext('2d');
    
    if (gpaChart) {
        gpaChart.destroy();
    }

    gpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: gpas.map((_, index) => `Semester ${index + 1}`),
            datasets: [{
                label: 'GPA Progress',
                data: gpas,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366f1',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function analyzePerformance(gpas) {
    const analysisDiv = document.getElementById('performanceAnalysis');
    const recommendationsDiv = document.getElementById('recommendations');
    
    const avgGPA = gpas.reduce((a, b) => a + b) / gpas.length;
    const lastGPA = gpas[gpas.length - 1];
    const previousGPA = gpas[gpas.length - 2];
    
    let analysisHTML = `
        <p>Average GPA: <strong>${avgGPA.toFixed(2)}</strong></p>
        <p>Latest GPA: <strong>${lastGPA.toFixed(2)}</strong></p>
    `;
    
    const strongPeriods = gpas.map((gpa, i) => ({gpa, semester: i+1}))
                             .filter(item => item.gpa >= 4.0);
    const weakPeriods = gpas.map((gpa, i) => ({gpa, semester: i+1}))
                           .filter(item => item.gpa < 2.5);
    
    if (strongPeriods.length > 0) {
        analysisHTML += `<p class="trend-positive">Excellent performance in semesters: 
            ${strongPeriods.map(p => p.semester).join(', ')}</p>`;
    }
    
    if (weakPeriods.length > 0) {
        analysisHTML += `<p class="trend-negative">Challenging periods in semesters: 
            ${weakPeriods.map(p => p.semester).join(', ')}</p>`;
    }

    let recommendationsHTML = '<ul>';
    
    // GPA Trend Analysis
    if (lastGPA < previousGPA) {
        recommendationsHTML += `
            <li class="trend-negative">Your GPA has decreased from ${previousGPA.toFixed(2)} to ${lastGPA.toFixed(2)}. 
            Consider:
            <ul>
                <li>Reviewing your study habits</li>
                <li>Setting up a consistent study schedule</li>
                <li>Seeking help from professors during office hours</li>
            </ul>
            </li>`;
    } else if (lastGPA > previousGPA) {
        recommendationsHTML += `
            <li class="trend-positive">Great improvement! Your GPA increased from ${previousGPA.toFixed(2)} to ${lastGPA.toFixed(2)}. 
            Keep maintaining:
            <ul>
                <li>Your current study routine</li>
                <li>Time management strategies</li>
                <li>Active participation in classes</li>
            </ul>
            </li>`;
    }

    // Overall Performance Recommendations
    if (avgGPA < 2.5) {
        recommendationsHTML += `
            <li class="trend-negative">Consider:
            <ul>
                <li>Meeting with an academic advisor</li>
                <li>Joining study groups</li>
                <li>Using university tutoring services</li>
            </ul>
            </li>`;
    } else if (avgGPA >= 4.0) {
        recommendationsHTML += `
            <li class="trend-positive">Outstanding performance! Consider:
            <ul>
                <li>Applying for honors programs</li>
                <li>Seeking research opportunities</li>
                <li>Mentoring other students</li>
            </ul>
            </li>`;
    }

    recommendationsHTML += '</ul>';

    analysisDiv.innerHTML = analysisHTML;
    recommendationsDiv.innerHTML = recommendationsHTML;
}

function calculateUnreleasedGPA() {
    const numSemesters = parseInt(document.getElementById("numSemesters").value);
    const updatedCGPA = parseFloat(document.getElementById("updatedCGPA").value);

    if (isNaN(updatedCGPA) || updatedCGPA < 0 || updatedCGPA > 5) {
        alert("Please enter a valid updated CGPA between 0 and 5.");
        return;
    }

    let totalGPA = 0;
    const gpas = [];
    
    // Validate and collect all semester GPAs
    for (let i = 1; i <= numSemesters; i++) {
        const gpa = parseFloat(document.getElementById(`gpa${i}`).value);
        if (isNaN(gpa) || gpa < 0 || gpa > 5) {
            alert(`Please enter a valid GPA for Semester ${i} (between 0 and 5).`);
            return;
        }
        totalGPA += gpa;
        gpas.push(gpa);
    }

    const totalSemesters = numSemesters + 1;
    const unreleasedGPA = ((updatedCGPA * totalSemesters) - totalGPA).toFixed(2);
    const unreleasedGPAValue = parseFloat(unreleasedGPA);

    document.getElementById("result").style.display = "block";
    
    if (unreleasedGPAValue > 5 || unreleasedGPAValue < 0) {
        document.getElementById("unreleasedGpaValue").textContent = "Invalid (check inputs)";
        return;
    }

    document.getElementById("unreleasedGpaValue").textContent = unreleasedGPA;
    gpas.push(unreleasedGPAValue);

    generateChart(gpas);
    analyzePerformance(gpas);
}

function resetForm() {
    document.getElementById("numSemesters").value = "";
    document.getElementById("gpaInputs").innerHTML = "";
    document.getElementById("updatedCGPA").value = "";
    document.getElementById("result").style.display = "none";
    if (gpaChart) {
        gpaChart.destroy();
    }
}
