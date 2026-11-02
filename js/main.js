"use strict";

// Highlight the active navigation link.
const currentPath = window.location.pathname;

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});

// Smooth scrolling for internal links.
document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href").split("#")[1];
        const target = document.getElementById(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});