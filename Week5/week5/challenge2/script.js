let main = document.getElementById("main");
let p = main.getElementsByTagName("p");
for (let i = 0; i < p.length; i++) 
{
    if (i == 5) {
    p[i].style.fontSize = "24px";
    p[i].style.color = "red";
    }
}