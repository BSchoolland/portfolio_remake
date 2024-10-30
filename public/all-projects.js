document.addEventListener("DOMContentLoaded", async function () {
    fetch("/projects.json")
        .then((response) => response.json())
        .then((projects) => {
            // Populating the filter dropdown with unique skills
            const allSkills = projects.flatMap((project) => project.skills);
            const skillFrequency = allSkills.reduce((acc, skill) => {
                acc[skill] = (acc[skill] || 0) + 1;
                return acc;
            }, {});

            const x = 2; // minimum number of projects a skill must appear in to be considered frequent
            const frequentSkills = Object.keys(skillFrequency).filter(skill => skillFrequency[skill] >= x);

            const uniqueFrequentSkills = Array.from(new Set(frequentSkills)).sort();
            const filterSelect = document.getElementById("filter");
            uniqueFrequentSkills.forEach((skill) => {
                const option = document.createElement("option");
                option.value = skill;
                option.textContent = skill;
                filterSelect.appendChild(option);
            });

            // Event listeners for sorting and filtering
            document
                .getElementById("order")
                .addEventListener("change", handleFilterChange);
            document
                .getElementById("filter")
                .addEventListener("change", handleFilterChange);
            document
                .getElementById("for")
                .addEventListener("change", handleFilterChange);
            function updateUrlParams() {
                const order = document.getElementById("order").value;
                const filterSkill = document.getElementById("filter").value;
                const projectType = document.getElementById("for").value;
                const searchQuery = document.getElementById("search").value;

                const params = new URLSearchParams(window.location.search);
                params.set("order", order);
                params.set("filter", filterSkill);
                params.set("for", projectType);
                params.set("search", searchQuery);

                history.pushState(
                    {},
                    "",
                    `${window.location.pathname}?${params}`
                );
            }

            function handleFilterChange() {
                const order = document.getElementById("order").value;
                const filterSkill = document.getElementById("filter").value;
                const projectType = document.getElementById("for").value;
                let filteredProjects = projects.filter(
                    (project) =>
                        projectType === "all" ||
                        project.for.toLowerCase().includes(projectType)
                );

                if (filterSkill !== "all") {
                    filteredProjects = filteredProjects.filter((project) =>
                        project.skills.includes(filterSkill)
                    );
                }
                updateUrlParams();

                switch (order) {
                    case "a-z":
                        filteredProjects.sort((a, b) =>
                            a.projectName.localeCompare(b.projectName)
                        );
                        break;
                    case "newest":
                        filteredProjects.sort(
                            (a, b) => new Date(b.date) - new Date(a.date)
                        );
                        break;
                    case "oldest":
                        filteredProjects.sort(
                            (a, b) => new Date(a.date) - new Date(b.date)
                        );
                        break;
                }

                // Search
                const searchQuery = document
                    .getElementById("search")
                    .value.toLowerCase();
                if (searchQuery) {
                    // in name or summary
                    filteredProjects = filteredProjects.filter(
                        (project) =>
                            project.projectName
                                .toLowerCase()
                                .includes(searchQuery) ||
                            project.summary.toLowerCase().includes(searchQuery)
                    );
                }

                updateDisplay(filteredProjects);
            }

            function updateDisplay(filteredProjects) {
                const container = document.getElementById(
                    "returned-projects-container"
                );
                container.innerHTML = ""; // Clear current content
                if (filteredProjects.length === 0) {
                    container.innerHTML =
                        "<p>No projects found with these filters.</p>";
                    return;
                }

                filteredProjects.forEach((project) => {
                    let skillsHtml = "<div>";
                    project.skills.forEach((skill) => {
                        skillsHtml += `<img class="project-skill-image" src="images/icons/${skill}.png" alt="${skill}" />`;
                    });
                    skillsHtml += "</div>";

                    const projectDiv = document.createElement("div");
                    projectDiv.className = "project";
                    let linksHtml = "";
                    if (project.live)
                        if (!project.skipLoading) {
                            linksHtml += `<a href="loading.html?projectUrl=${project.live}" target="_blank">Live</a>`;
                        } else {
                            linksHtml += `<a href="${project.live}" target="_blank">Live</a>`;
                        }
                            
                    if (project.github)
                        linksHtml += `<a href="${project.github}" target="_blank">GitHub</a>`;
                    if (project.page)
                        linksHtml += `<a href="${project.page}">More Info</a>`;
                    projectDiv.innerHTML = `
                        <h3>${project.projectName}</h3>
                        ${skillsHtml}
                        <p>${project.summary}</p>
                        <div style="display: flex; justify-content: center;">
                            <img src="${project.image}" style="max-width: 75%; max-height: 300px; cursor: pointer" alt="${project.projectName}" alt="${project.projectName}" onClick="window.location.href='${project.page}'" />
                        </div>
                        <br />
                        <div>
                        ${linksHtml}
                        </div>
                    `;
                    container.appendChild(projectDiv);
                });
            }

            function setFiltersFromUrl() {
                const params = new URLSearchParams(window.location.search);
                const order = params.get("order");
                const filterSkill = params.get("filter");
                const projectType = params.get("for");
                const searchQuery = params.get("search");
            
                if (order) document.getElementById("order").value = order;
                if (filterSkill) document.getElementById("filter").value = filterSkill;
                if (projectType) document.getElementById("for").value = projectType;
                if (searchQuery) document.getElementById("search").value = searchQuery;
            }
            // do these actions in the right order
            setTimeout(() => {
                setFiltersFromUrl();
            }, 0);
            setTimeout(() => {
                handleFilterChange();
            }, 1);

            // when the user types in the search box, filter the projects
            document
                .getElementById("search")
                .addEventListener("input", handleFilterChange);

            document
                .getElementById("filter")
                .insertAdjacentHTML(
                    "afterbegin",
                    '<option value="all" selected>All Skills</option>'
                );
        })
        .catch((error) => console.error("Error:", error));
});


document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu ul');
    let shown = false;
    hamburger.addEventListener('click', function() {
        navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
        shown = !shown;
    });
    // if the user clicks anywhere outside the nav menu, close it
    document.addEventListener('click', function(event) {

        if (!event.target.closest('.hamburger') && shown) {
            navMenu.style.display = 'none';
            shown = false;
        }
    });
});