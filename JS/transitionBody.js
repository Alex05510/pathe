document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("fade-out"); // fade-in à l'arrivée

  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.href;
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = target;
        }, 100); // durée de la transition
      });
    }
  });
});
document.getElementById("clear-filters").onclick = function () {
  // Supprime toutes les données de réservation
  localStorage.removeItem("filmChoisi");
  localStorage.removeItem("placesLibres");
  localStorage.removeItem("salleNum");
  localStorage.removeItem("tarifs");
  localStorage.removeItem("panierTarif");
  localStorage.removeItem("totalSnack");
  localStorage.removeItem("filmData");
  localStorage.removeItem("snackPanier");

  // Réinitialise les filtres de recherche
  document.getElementById("search-input").value = "";
  document.getElementById("genre-select").value = "";
  document.getElementById("langue-select").value = "";
  document.getElementById("btn-4k").classList.remove("active");
  document.getElementById("btn-4k").style.backgroundColor = "";

  // Recharge la page pour tout remettre à zéro
  location.reload();
  simpleFilter();
};

const clearBtn = document.getElementById("clear-filters");
if (clearBtn) {
  clearBtn.onclick = function () {
    localStorage.clear();
    location.reload();
  };
}
