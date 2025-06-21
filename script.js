//initializing variables to be used to manipulate DOM directly or indirectly

let jobs = [];

const jobContainer = document.getElementById("jobs");
const departmentFilter = document.getElementById("departmentFilter");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const modal = document.getElementById("modal");

const modalTitle = document.getElementById("modalTitle");
const modalDepartment = document.getElementById("modalDepartment");
const modalLocation = document.getElementById("modalLocation");
const modalDescription = document.getElementById("modalDescription");
const applyLink = document.getElementById("applyLink");
const hamburger = document.getElementById("hamburger");
const responsiveNavbar = document.getElementById("responsiveNavbar");


//to display or hide modal
document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
});

//show the loading jobs or not
loader.classList.remove("hidden");

//fetch jobs
fetch("mock-jobs.json")
    .then(res => res.json())
    .then(async data => {
        jobs = data;
        applyFilters(jobs);
        await showJobs(jobs);
        loader.classList.add("hidden");
    })
    .catch(error => {
        loader.innerHTML = "<p style='color: red;'>Failed to load jobs.</p>";
        console.error("Error fetching jobs:", error);
    });

//department filtering drop-down
function applyFilters(jobs) {
    const departments = [...new Set(jobs.map(j => j.department))];
    departments.forEach(dep => {
        const option = document.createElement("option");
        option.value = dep;
        option.textContent = dep;
        departmentFilter.appendChild(option);
    });
}

//job list display
async function showJobs(filteredJobs) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    jobContainer.innerHTML = "";

    if (filteredJobs.length === 0) {
        jobContainer.innerHTML = "<p style='color: white;'>No jobs found.</p>";
        return;
    }

    filteredJobs.forEach(job => {
        const div = document.createElement("div");
        div.className = "job-card";
        div.innerHTML = `
      <h3 class="job-heading">${job.title}</h3>
      <p class="job-content">${job.department}</p>
      <p class="job-content">${job.location}</p>
      <button onclick="openModal(${job.id})" class="apply-btn">Apply</button>
    `;
        jobContainer.appendChild(div);
    });
}

//displaying modal
function openModal(id) {
    const job = jobs.find(j => j.id === id);
    modalTitle.textContent = job.title;
    modalDepartment.textContent = `Department: ${job.department}`;
    modalLocation.textContent = `Location: ${job.location}`;
    modalDescription.textContent = job.description;
    applyLink.href = "#";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
}

//triggering filer job functions w.r.t change in dropdown/search values
departmentFilter.addEventListener("change", filterJobs);
searchInput.addEventListener("input", filterJobs);

// function to filter jobs 
async function filterJobs() {
    const dep = departmentFilter.value.toLowerCase();
    const search = searchInput.value.toLowerCase();

    let filtered;

    if (search) {
        filtered = jobs.filter(job =>
            job.title.toLowerCase().includes(search)
        );
    } else if (dep) {
        filtered = jobs.filter(job =>
            job.department.toLowerCase() === dep
        );
    } else {
        filtered = jobs;
    }

    jobContainer.innerHTML = "";          
    loader.classList.remove("hidden");     
    await showJobs(filtered);              
    loader.classList.add("hidden");        
}



//showing hamburger and responsive navbar on smaller screens
hamburger.addEventListener("click", () => {
    responsiveNavbar.classList.toggle("hidden");
});

//switiching dark and light themes
const themeToggle = document.getElementById("themeToggle");


if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "light");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "dark");
    }
});


document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
    }
});
