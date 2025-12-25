let links = document.querySelectorAll("nav a");

links.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        alert(link.innerHTML);
    });
});