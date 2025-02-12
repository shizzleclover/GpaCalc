let gpaChart = null;

// Add this new function to handle historical GPA data
function getHistoricalGPAs(previousCGPA, previousUnits, lastGPA) {
    // Estimate previous semester GPAs based on CGPA
    const estimatedGPAs = [previousCGPA];
    
    // Add the calculated semester GPA
    if (lastGPA >= 0 && lastGPA <= 5) {
        estimatedGPAs.push(lastGPA);
    }
    
    return estimatedGPAs;
}

function generateInputs() {
    const numSemesters = parseInt(document.getElementById("numSemesters").value);
    if (isNaN(numSemesters) || numSemesters < 1 || numSemesters > 12) {
        alert("Please enter a valid number of semesters (1-12).");
        return;
    }

    const gpaInputs = document.getElementById("gpaInputs");
    gpaInputs.innerHTML = "";

    for (let i = 1; i <= numSemesters; i++) {
        const semesterDiv = document.createElement("div");
        semesterDiv.classList.add("semester-group");

        // GPA Input
        const gpaDiv = document.createElement("div");
        gpaDiv.classList.add("input-group");
        const gpaLabel = document.createElement("label");
        gpaLabel.textContent = `Semester ${i} GPA:`;
        const gpaInput = document.createElement("input");
        gpaInput.type = "number";
        gpaInput.step = "0.01";
        gpaInput.min = "0";
        gpaInput.max = "5";
        gpaInput.id = `gpa${i}`;
        gpaInput.placeholder = "Enter GPA (0-5)";
        gpaDiv.appendChild(gpaLabel);
        gpaDiv.appendChild(gpaInput);

        // Credit Hours Input
        const creditDiv = document.createElement("div");
        creditDiv.classList.add("input-group");
        const creditLabel = document.createElement("label");
        creditLabel.textContent = `Semester ${i} Credit Hours:`;
        const creditInput = document.createElement("input");
        creditInput.type = "number";
        creditInput.min = "1";
        creditInput.id = `credits${i}`;
        creditInput.placeholder = "Enter credit hours";
        creditDiv.appendChild(creditLabel);
        creditDiv.appendChild(creditInput);

        semesterDiv.appendChild(gpaDiv);
        semesterDiv.appendChild(creditDiv);
        gpaInputs.appendChild(semesterDiv);
    }
}

// Update the chart generation function
function generateChart(gpas) {
    const ctx = document.getElementById('gpaChart').getContext('2d');
    
    if (gpaChart) {
        gpaChart.destroy();
    }

    gpaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: gpas.map((_, index) => index === 0 ? 'Previous' : 'Current'),
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

// Update the calculation function
function calculateUnreleasedGPA() {
    const updatedCGPA = parseFloat(document.getElementById("updatedCGPA").value);
    const previousCGPA = parseFloat(document.getElementById("previousCGPA").value);
    const currentUnits = parseInt(document.getElementById("currentUnits").value);
    const previousUnits = parseInt(document.getElementById("previousUnits").value);

    if (!validateInputs(updatedCGPA, previousCGPA, currentUnits, previousUnits)) {
        return;
    }

    const semesterUnits = currentUnits - previousUnits;
    const unreleasedGPA = ((updatedCGPA * currentUnits) - (previousCGPA * previousUnits)) / semesterUnits;
    const formattedGPA = unreleasedGPA.toFixed(2);

    displayResults(
        unreleasedGPA,
        formattedGPA,
        {updatedCGPA, previousCGPA, currentUnits, previousUnits, semesterUnits}
    );

    const gpas = [previousCGPA, parseFloat(formattedGPA)];
    generateChart(gpas);
    analyzePerformance(gpas);
}

// Update the analysis function to handle two-point data
function analyzePerformance(gpas) {
    const analysisDiv = document.getElementById('performanceAnalysis');
    const recommendationsDiv = document.getElementById('recommendations');
    
    const previousGPA = gpas[0];
    const currentGPA = gpas[gpas.length - 1];
    const difference = currentGPA - previousGPA;
    
    let analysisHTML = `
        <p>Previous CGPA: <strong>${previousGPA.toFixed(2)}</strong></p>
        <p>Current Semester GPA: <strong>${currentGPA.toFixed(2)}</strong></p>
        <p>GPA Change: <strong class="${difference > 0 ? 'trend-positive' : difference < 0 ? 'trend-negative' : 'trend-neutral'}">
            ${difference > 0 ? '+' : ''}${difference.toFixed(2)}
        </strong></p>
    `;

    let recommendationsHTML = '<ul>';
    
    if (difference < 0) {
        recommendationsHTML += `
            <li class="trend-negative">Your GPA has decreased by ${Math.abs(difference).toFixed(2)} points. 
            Consider:
            <ul>
                <li>Reviewing your study habits</li>
                <li>Setting up a consistent study schedule</li>
                <li>Seeking help from professors during office hours</li>
            </ul>
            </li>`;
    } else if (difference > 0) {
        recommendationsHTML += `
            <li class="trend-positive">Great improvement! Your GPA increased by ${difference.toFixed(2)} points. 
            Keep maintaining:
            <ul>
                <li>Your current study routine</li>
                <li>Time management strategies</li>
                <li>Active participation in classes</li>
            </ul>
            </li>`;
    }

    recommendationsHTML += '</ul>';

    analysisDiv.innerHTML = analysisHTML;
    recommendationsDiv.innerHTML = recommendationsHTML;
}

function validateSemesterInput(gpa, credits, semesterNum) {
    if (isNaN(gpa) || gpa < 0 || gpa > 5) {
        alert(`Please enter a valid GPA for semester ${semesterNum} (between 0 and 5).`);
        return false;
    }
    if (isNaN(credits) || credits < 1) {
        alert(`Please enter valid credit hours for semester ${semesterNum}.`);
        return false;
    }
    return true;
}

function validateInputs(updatedCGPA, previousCGPA, currentUnits, previousUnits) {
    if (isNaN(updatedCGPA) || updatedCGPA < 0 || updatedCGPA > 5) {
        alert("Please enter a valid updated CGPA between 0 and 5.");
        return false;
    }
    if (isNaN(previousCGPA) || previousCGPA < 0 || previousCGPA > 5) {
        alert("Please enter a valid previous CGPA between 0 and 5.");
        return false;
    }
    if (isNaN(currentUnits) || currentUnits <= 0) {
        alert("Please enter valid current total credit hours.");
        return false;
    }
    if (isNaN(previousUnits) || previousUnits < 0 || previousUnits >= currentUnits) {
        alert("Previous credit hours must be less than current credit hours.");
        return false;
    }
    return true;
}

function displayResults(unreleasedGPA, formattedGPA, params) {
    document.getElementById("result").style.display = "block";
    
    if (unreleasedGPA > 5 || unreleasedGPA < 0) {
        document.getElementById("unreleasedGpaValue").textContent = "Invalid (check inputs)";
        return;
    }

    const breakdownHTML = `
        <div class="calculation-steps">
            <h3>Calculation Breakdown</h3>
            <p>Formula: (Current CGPA × Current Units - Previous CGPA × Previous Units) ÷ Semester Units</p>
            <ul>
                <li>Previous CGPA: ${params.previousCGPA}</li>
                <li>Previous Units: ${params.previousUnits}</li>
                <li>Current CGPA: ${params.updatedCGPA}</li>
                <li>Current Units: ${params.currentUnits}</li>
                <li>This Semester Units: ${params.semesterUnits}</li>
                <li>Calculation: (${params.updatedCGPA} × ${params.currentUnits} - ${params.previousCGPA} × ${params.previousUnits}) ÷ ${params.semesterUnits}</li>
                <li>Result: ${formattedGPA}</li>
            </ul>
        </div>
    `;
    
    document.getElementById("calculationBreakdown").innerHTML = breakdownHTML;
    document.getElementById("unreleasedGpaValue").textContent = formattedGPA;
}

function resetForm() {
    const fieldsToReset = ["previousCGPA", "updatedCGPA", "currentUnits", "previousUnits"];
    fieldsToReset.forEach(field => document.getElementById(field).value = "");
    document.getElementById("result").style.display = "none";
    document.getElementById("calculationBreakdown").innerHTML = "";
    if (gpaChart) {
        gpaChart.destroy();
    }
}
