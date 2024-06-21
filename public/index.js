document.addEventListener("DOMContentLoaded", async function () {
    fetch("/projects.json")
        .then((response) => response.json())
        .then((projects) => {
            const projectList = document.getElementById("projects-container");
            // only use the first 4 projects as these are the ones that will be displayed
            projects.slice(0, 4).forEach((project) => {
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


const showPhone = document.getElementById('show-phone');
showPhone.addEventListener('click', function() {
    showPhone.innerHTML = '(209)'
    showPhone.innerHTML += ' 573-'
    showPhone.innerHTML += '0059'
});
