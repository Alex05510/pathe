document.addEventListener("DOMContentLoaded", function () {
  // TArif
  const tarifs = {
    matin: { label: "Matin", prix: 9.9, qty: 0 },
    enfant: { label: "Moins de 14 ans", prix: 6.5, qty: 0 },
  };

  // Recup info film
  function loadFilmData() {
    // Récupère les infos film depuis le localStorage
    let filmData = JSON.parse(localStorage.getItem("filmData")) || {};
    filmData.image = filmData.image || "";
    filmData.titre = filmData.titre || "";
    filmData.horaire = filmData.horaire || "";
    filmData.version = filmData.version || "VO";
    filmData.salle = filmData.salle || "";
    filmData.handicap = filmData.handicap || false;
    filmData.fin = filmData.fin || "";
    filmData.libres = filmData.libres || 0;

    localStorage.setItem("filmData", JSON.stringify(filmData));
    return filmData;
  }

  function renderFilm(filmData) {
    const filmContainer = document.querySelector(".film");
    if (!filmContainer) return;

    filmContainer.innerHTML = `
      <div class="film-img">
        <img src="${filmData.image}" alt="${filmData.titre}" />
      </div>
      <div class="film-info">
        <div class="info-logo">
          <img src="../Assets/Pictos/logo-international-white 1.png" alt="Logo" />
        </div>
        <img src="${filmData.image}" alt="${
      filmData.titre
    }" class="film-couverture" />
        <h2>${filmData.titre}</h2>
        <button><a href="../HTML/presentation.html">Changer de film</a></button>
        <p>Séance : ${filmData.horaire} ${filmData.version}</p>
        <p class="finPrevu">${
          filmData.fin ? "Fin prévue : " + filmData.fin : ""
        }</p>
        <p class="film-salle">${
          filmData.salle ? "Salle " + filmData.salle : ""
        } ${
      filmData.handicap
        ? "<img src='../Assets/Pictos/desactive-black.png' alt='Handicapé' style='width:20px;vertical-align:middle;' />"
        : ""
    }</p>
      </div>
    `;
  }

  // Tarifs
  function saveTarifs() {
    localStorage.setItem("tarifs", JSON.stringify(tarifs));
  }

  function loadTarifs() {
    const saved = JSON.parse(localStorage.getItem("tarifs"));
    if (saved) {
      for (let key in tarifs) {
        if (saved[key]) tarifs[key].qty = saved[key].qty;
      }
    }
  }

  function updateQty(tarif, delta) {
    tarifs[tarif].qty = Math.max(0, tarifs[tarif].qty + delta);
    document.getElementById("qty-" + tarif).textContent = tarifs[tarif].qty;
    updateSummary();
    saveTarifs();
  }

  function setupButtons() {
    document
      .querySelectorAll(".moins")
      .forEach((btn) =>
        btn.addEventListener("click", () => updateQty(btn.dataset.tarif, -1))
      );
    document
      .querySelectorAll(".plus")
      .forEach((btn) =>
        btn.addEventListener("click", () => updateQty(btn.dataset.tarif, 1))
      );
  }

  function updateSummary() {
    let summary = "";
    let total = 0;
    let panierTarif = {};

    for (let key in tarifs) {
      if (tarifs[key].qty > 0) {
        const subtotal = tarifs[key].prix * tarifs[key].qty;
        summary += `<div>${tarifs[key].qty}x ${
          tarifs[key].label
        } <span>${subtotal.toFixed(2)}€</span></div>`;
        total += subtotal;
        panierTarif[key] = tarifs[key];
      }
    }

    document.getElementById(
      "tarif-summary"
    ).innerHTML = `<h4>Mes tarifs</h4>${summary}`;
    document.getElementById(
      "tarif-total"
    ).innerHTML = `Total à régler <span>${total.toFixed(2)}€</span>`;

    localStorage.setItem("tarifTotal", total.toFixed(2));
    localStorage.setItem("tarifs", JSON.stringify(panierTarif));
  }

  // Initialisation
  const filmData = loadFilmData();
  renderFilm(filmData);
  loadTarifs();
  setupButtons();
  updateSummary();
});
