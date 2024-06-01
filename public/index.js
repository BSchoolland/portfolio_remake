document.addEventListener("DOMContentLoaded", async function () {
    fetch("/projects.json")
        .then((response) => response.json())
        .then((projects) => {
            const projectList = document.getElementById("projects-container");
            // only use the first 3 projects as these are the ones that will be displayed
            projects.slice(0, 3).forEach((project) => {
                const projectDiv = document.createElement("div");
                projectDiv.className = "project";
                let linksHtml = "<div class='links'>";
                if (project.live)
                    linksHtml += `<a href="loading.html?projectUrl=${project.live}" target="_blank">Live</a>`;
                if (project.github)
                    linksHtml += `<a href="${project.github}" target="_blank">GitHub</a>`;
                if (project.page)
                    linksHtml += `<a href="${project.page}">More Info</a>`;
                linksHtml += "</div>";

                let skillsHtml = "<div>";
                project.skills.forEach((skill) => {
                    skillsHtml += `<img class="project-skill-image" src="images/icons/${skill}.png" alt="${skill}" />`;
                });
                skillsHtml += "</div>";
                projectDiv.innerHTML = `
                        <h3>${project.projectName}</h3>
                        ${skillsHtml}
                        <p>${project.summary}</p>
                        <div style="display: flex; justify-content: center; cursor: pointer;">
                            <img src="${project.image}" alt="${project.projectName}" onClick="window.location.href='${project.page}'" />
                        </div>
                        <br />
                        ${linksHtml}
                    `;
                projectList.appendChild(projectDiv);
            });
        });
});
