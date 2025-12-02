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
                    if (!project.skipLoading) {
                        linksHtml += `<a href="loading.html?projectUrl=${project.live}" target="_blank">Live</a>`;
                    } else {
                        linksHtml += `<a href="${project.live}" target="_blank">Live</a>`;
                    }
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
                        <div style="display: flex; justify-content: center;">
                            <img src="${project.image}" alt="${project.projectName}" />
                        </div>
                        <br />
                        ${linksHtml}
                    `;
                
                // Make the entire card clickable to go to the page (if it exists)
                if (project.page) {
                    projectDiv.style.cursor = 'pointer';
                    projectDiv.addEventListener('click', function(e) {
                        // Only navigate if the click wasn't on a link/button
                        if (!e.target.closest('a')) {
                            window.location.href = project.page;
                        }
                    });
                }
                
                projectList.appendChild(projectDiv);
            });

            // After projects are loaded, check for hash and scroll if needed
            if (window.location.hash) {
                const element = document.querySelector(window.location.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }

            // Populating the skills section with all the skills from the projects
            const allSkills = projects.flatMap((project) => project.skills);
            const skillFrequency = allSkills.reduce((acc, skill) => {
                acc[skill] = (acc[skill] || 0) + 1;
                return acc;
            }, {});

            const x = 2; // minimum number of projects a skill must appear in to be considered frequent
            const frequentSkills = Object.keys(skillFrequency).filter(skill => skillFrequency[skill] >= x);

            const skillsContainer = document.getElementById("skills-container");

            // each skill will create an object like this:
            // <li onclick="window.location.href='/all-projects?filter=HTML'"><a
            //                 href="/all-projects?filter=HTML">HTML</a></li>
            frequentSkills.forEach((skill) => {
                const skillElement = document.createElement("li");
                skillElement.innerHTML = `<a href="/all-projects?filter=${skill}">${skill}</a>`;
                skillElement.style.cursor = 'pointer';
                skillElement.addEventListener('click', function() {
                    window.location.href = `/all-projects?filter=${skill}`;
                });
                skillsContainer.appendChild(skillElement);
            }
            );
            
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
