"use strict";

function toggleDarkMode() {
    var theme = localStorage.getItem("scheme"),
        toggle = document.getElementById("scheme-toggle"),
        container = document.getElementsByTagName("html")[0];

    if (theme === "dark") {
        if (typeof feather !== "undefined") {
            toggle.innerHTML = feather.icons.sun.toSvg();
        }
        container.className = "dark";
    } else {
        if (typeof feather !== "undefined") {
            toggle.innerHTML = feather.icons.moon.toSvg();
        }
        container.className = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const globalDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localMode = localStorage.getItem("scheme");
    const mode = document.getElementById("scheme-toggle");

    if (globalDark && (localMode === null)) {
        localStorage.setItem("scheme", "dark");
    }

    if (mode !== null) {
        toggleDarkMode();

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
            if (event.matches) {
                localStorage.setItem("scheme", "dark");
            } else {
                localStorage.setItem("scheme", "light");
            }

            toggleDarkMode();
        });

        mode.addEventListener("click", function () {
            localStorage.setItem("scheme", document.documentElement.classList.contains('dark') ? "light" : "dark");
            toggleDarkMode();
        });
    }

    // Make all external links in descriptions open in new tabs
    const descriptionLinks = document.querySelectorAll('.description a');
    descriptionLinks.forEach(function(link) {
        // Check if the link is external (doesn't start with current domain or relative path)
        if (link.href && !link.href.startsWith(window.location.origin) && !link.href.startsWith('#') && !link.href.startsWith('mailto:')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});
