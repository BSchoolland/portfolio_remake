document.addEventListener("DOMContentLoaded", async function () {
    fetch("../projects.json")
        .then((response) => response.json())
        .then((projects) => {
            const projectUrl = window.location.href;
            const projectPath = projectUrl.split("/").pop();
            const project = projects.find((project) =>
                project.page.includes(projectPath)
            );
            const intro = document.querySelector(".intro-inner");
            const links = document.querySelector(".links-inner");

            // Create a new image object
            const img = new Image();
            img.src = `../${project.image}`;
            img.alt = `${project.projectName}`;
            img.style = "max-width: 100%; max-height: 800px";

            // Wait for the image to load
            img.onload = function () {
                intro.innerHTML = `
                            <h1>${project.projectName}</h1>
                            <p>${project.summary}</p>
                            <div style="display: flex; justify-content: center;">
                        `;
                intro.appendChild(img); // Add the image to the DOM

                if (project.github) {
                    links.innerHTML += `<a href="${project.github}" target="_blank">GitHub</a>`;
                }
                if (project.live) {
                    links.innerHTML += `<a href="/loading.html?projectUrl=${project.live}" target="_blank">Live Site</a>`;
                }

                // Hide the loading screen
                document.getElementById("loading-screen").style.display =
                    "none";
            };
        })
        .catch((error) => {
            console.error("Error:", error);

            // Hide the loading screen even if there was an error
            document.getElementById("loading-screen").style.display = "none";
        });
});
