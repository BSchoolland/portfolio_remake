document.addEventListener("DOMContentLoaded", async function () {
    fetch("/projects.json")
        .then((response) => response.json())
        .then((projects) => {
            const projectList = document.getElementById("projects-container");
            // only use the first 3 projects as these are the ones that will be displayed
            projects.slice(0, 3).forEach((project) => {
                const projectDiv = document.createElement("div");
                projectDiv.className = "project";
                let linksHtml = "";
                if (project.live)
                    linksHtml += `<a href="${project.live}" target="_blank">Live</a>`;
                if (project.github)
                    linksHtml += `<a href="${project.github}" target="_blank">GitHub</a>`;
                if (project.page)
                    linksHtml += `<a href="${project.page}" target="_blank">More Info</a>`;
                projectDiv.innerHTML = `
                        <h3>${project.projectName}</h3>
                        <p>${project.summary}</p>
                        <div style="display: flex; justify-content: center;">
                            <img src="${project.image}" style="max-width: 75%; max-height: 300px;" alt="${project.projectName}" />
                        </div>
                        <br />
                        ${linksHtml}
                    `;
                projectList.appendChild(projectDiv);
            });
        });
});
