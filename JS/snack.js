let panier = {}; // Snacks
let tarifsPanier = {}; // Billets

document.addEventListener("DOMContentLoaded", function () {
  // Recharge le panier snack depuis le localStorage si présent
  panier = JSON.parse(localStorage.getItem("snackPanier") || "{}");

  const filmData = loadFilmData(); // récupère les infos film
  renderFilm(filmData); // affiche l'UI film

  loadTarifsFromStorage();
  fetchSnacks();
});

// Gestion film

function loadFilmData() {
  // Récupère les infos film depuis le localStorage
  let filmData = JSON.parse(localStorage.getItem("filmData")) || {};
  filmData.image = filmData.image || "";
  filmData.titre = filmData.titre || "";
  filmData.horaire = filmData.horaire || "";
  filmData.version = filmData.version || "";
  filmData.salle = filmData.salle || "";
  filmData.handicap = filmData.handicap || false;

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
      <p>Séances : ${filmData.horaire} ${filmData.version}</p>
      <p class="finPrevu">${
        filmData.fin ? "Fin prévue : " + filmData.fin : ""
      }</p>
      <p class="film-salle">
        ${filmData.salle ? "Salle " + filmData.salle : ""}
        ${
          filmData.handicap
            ? '<img src="../Assets/Pictos/desactive-black.png" alt="Handicapé" style="width:20px;vertical-align:middle;" />'
            : ""
        }
      </p>
    </div>
  `;
}

// Gestion tarif
function loadTarifsFromStorage() {
  const savedTarifs = JSON.parse(localStorage.getItem("tarifs"));
  if (savedTarifs) {
    Object.keys(savedTarifs).forEach((key) => {
      if (savedTarifs[key].qty > 0) {
        tarifsPanier[key] = savedTarifs[key];
      }
    });
  }
  updatePanierDisplay();
}

// Gestion snacks

function fetchSnacks() {
  fetch("../Assets/snack.json")
    .then((response) => response.json())
    .then((data) => {
      const snackContainer = document.getElementById("snack");
      snackContainer.innerHTML =
        "<h1>Profitez encore plus de votre séance</h1>";

      Object.keys(data).forEach((categorie) => {
        const catDiv = document.createElement("div");
        catDiv.classList.add("snack-categorie");
        catDiv.innerHTML = `<h2>${categorie}</h2>`;

        const snacksDiv = document.createElement("div");
        snacksDiv.classList.add("snack-items");

        data[categorie].forEach((snack) => {
          const snackDiv = createSnackItem(snack);
          snacksDiv.appendChild(snackDiv);
        });

        catDiv.appendChild(snacksDiv);
        snackContainer.appendChild(catDiv);
      });

      updatePanierDisplay();
    });
}

function createSnackItem(snack) {
  const snackDiv = document.createElement("div");
  snackDiv.classList.add("snack-item");
  snackDiv.innerHTML = `
    <img src="../Assets/Snack/${snack.image}" alt="${
    snack.nom
  }" style="width: 74px;"/>
    <p>${snack.nom}</p>
    <div class="carte-footer">
      <span><b>${snack.prix}</b> €</span>
      <button class="quantité-inf"><img src="../Assets/Pictos/bouton-moins.png" alt="-" style="width: 15px;"/></button>
      <span class="quantité">${panier[snack.nom]?.quantite || 0}</span>
      <button class="quantité-sup"><img src="../Assets/Pictos/cercle.png" alt="+" style="width: 15px;"/></button>
    </div>
  `;

  const btnPlus = snackDiv.querySelector(".quantité-sup");
  const btnMoins = snackDiv.querySelector(".quantité-inf");
  const qtySpan = snackDiv.querySelector(".quantité");

  btnPlus.addEventListener("click", () => {
    panier[snack.nom] = panier[snack.nom] || { ...snack, quantite: 0 };
    panier[snack.nom].quantite++;
    qtySpan.textContent = panier[snack.nom].quantite;
    updatePanierDisplay();
  });

  btnMoins.addEventListener("click", () => {
    if (panier[snack.nom] && panier[snack.nom].quantite > 0) {
      panier[snack.nom].quantite--;
      qtySpan.textContent = panier[snack.nom].quantite;
      updatePanierDisplay();
    }
  });

  return snackDiv;
}

// Gestion panier
function updatePanierDisplay() {
  const itemsContainer = document.getElementById("snack-panier");
  const totalContainer = document.querySelector(".panier");
  if (!itemsContainer || !totalContainer) return;

  let itemsHtml = "<h3>Mon Panier</h3>";
  let total = 0;

  // Tarifs
  Object.values(tarifsPanier).forEach((item) => {
    itemsHtml += renderPanierItem(item, "tarif", item.label);
    total += item.prix * item.qty;
  });

  // Snacks
  Object.values(panier).forEach((item) => {
    if (item.quantite > 0) {
      itemsHtml += renderPanierItem(item, "snack", item.nom);
      total += item.prix * item.quantite;
    }
  });

  itemsContainer.innerHTML = itemsHtml || "<p>Votre panier est vide.</p>";
  totalContainer.innerHTML = `
    <div class="panier-total">
      Total à régler : <b>${total.toFixed(2)} €</b>
    </div>
  `;

  // Boutons supprimer
  document.querySelectorAll(".supprimer-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const type = btn.dataset.type;
      const key = btn.dataset.key;
      if (type === "tarif") delete tarifsPanier[key];
      if (type === "snack") delete panier[key];
      updatePanierDisplay();
    });
  });

  // Sauvegarde
  localStorage.setItem("snackPanier", JSON.stringify(panier));
  localStorage.setItem("totalSnack", total.toFixed(2));
}

function renderPanierItem(item, type, key) {
  const qty = item.qty || item.quantite;
  return `
    <div class="panier-item">
      ${qty}x ${item.label || item.nom}
      <span>
        ${(item.prix * qty).toFixed(2)} €
        <img src="../Assets/Pictos/poubelle.png" alt="Supprimer" 
             class="supprimer-item" data-type="${type}" data-key="${key}" 
             style="width: 20px;height:20px;"/>
      </span>
    </div>`;
}
