function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle svg');
    if (theme === 'dark') {
        icon.innerHTML = '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
    } else {
        icon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

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

        div.appendChild(label);
        div.appendChild(input);
        gpaInputs.appendChild(div);
    }
}

function calculateUnreleasedGPA() {
    const numSemesters = parseInt(document.getElementById("numSemesters").value);
    const updatedCGPA = parseFloat(document.getElementById("updatedCGPA").value);

    if (isNaN(updatedCGPA) || updatedCGPA < 0 || updatedCGPA > 5) {
        alert("Please enter a valid updated CGPA between 0 and 5.");
        return;
    }

    let totalGPA = 0;
    for (let i = 1; i <= numSemesters; i++) {
        const gpa = parseFloat(document.getElementById(`gpa${i}`).value) || 0;
        if (gpa < 0 || gpa > 5) {
            alert(`Please enter a valid GPA for Semester ${i} (between 0 and 5).`);
            return;
        }
        totalGPA += gpa;
    }

    const totalSemesters = numSemesters + 1;
    const unreleasedGPA = ((updatedCGPA * totalSemesters) - totalGPA).toFixed(2);

    document.getElementById("result").style.display = "block";
    document.getElementById("unreleasedGpaValue").textContent = (unreleasedGPA > 5 || unreleasedGPA < 0) ? "Invalid (check inputs)" : unreleasedGPA;
}

function resetForm() {
    document.getElementById("numSemesters").value = "";
    document.getElementById("gpaInputs").innerHTML = "";
    document.getElementById("updatedCGPA").value = "";
    document.getElementById("result").style.display = "none";
}
