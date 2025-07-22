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

    // Make all external links open in new tabs
    const allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(function(link) {
        // Check if the link is external
        if (link.href && 
            (link.href.startsWith('http://') || link.href.startsWith('https://')) &&
            !link.href.startsWith(window.location.origin) && 
            !link.href.startsWith('mailto:') && 
            !link.href.startsWith('tel:')) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});
