const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-menu-toggle");


window.addEventListener('load', () => {
    window.history.pushState('','','/',('#'),[0]);
    }); 
    window.addEventListener('hashchange', () => {
    window.history.pushState('','','/',('#'),[0]);
    });

navToggle.addEventListener('click', () => {
    const visibility = primaryNav.getAttribute('data-visible');
    if (visibility === "false") {
        primaryNav.setAttribute('data-visible', true);
        navToggle.setAttribute('aria-expanded', true);
    } else if (visibility === "true") {
        primaryNav.setAttribute('data-visible', false);
        navToggle.setAttribute('aria-expanded', false);
    }

document.querySelectorAll(".nav-item").forEach(n => n.addEventListener("click", () => {
    primaryNav.setAttribute('data-visible', false);
    navToggle.setAttribute('aria-expanded', false);
}))
});

