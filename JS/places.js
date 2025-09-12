// Constantes globales
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NB_RANGES = 13; // nombre de rangées
const NB_SIEGES = 16; // sièges par rangée

// Génère une liste de sièges pris aléatoirement (15% pris)
function getSiegesPris(nbRangees, nbSieges, pourcentagePris = 0.15) {
  const totalSieges = nbRangees * nbSieges;
  const nbPris = Math.floor(totalSieges * pourcentagePris);
  const sieges = [];

  for (let row = 0; row < nbRangees; row++) {
    for (let seat = 1; seat <= nbSieges; seat++) {
      sieges.push(`${ALPHABET[row]}${seat}`);
    }
  }

  // Mélange
  for (let i = sieges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sieges[i], sieges[j]] = [sieges[j], sieges[i]];
  }

  return sieges.slice(0, nbPris);
}

// Récupère les infos film depuis URL ou localStorage
function loadFilmData() {
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

const filmData = loadFilmData();
const salle = filmData.salle || "";
const libres = filmData.libres || 0;
const titre = filmData.titre || "";
const image = filmData.image || "";
const horaire = filmData.horaire || "";
const isHandicap = filmData.handicap === true || filmData.handicap === "true";
const version = filmData.version || "VO";
const fin = filmData.fin || "";

// Génération HTML de la salle
const placesSection = document.querySelector(".places");
let html = "";

html += `<h2>Sélectionnez vos places</h2>
<p>${libres} places libres</p><div class='salle'>`;

// Rangée handicapés
html += '<div class="rangee">';
for (let i = 0; i < 6; i++) {
  html += `<span class="siege handicap" data-id="H${i + 1}"></span>`;
}
html += "</div>";

// Génère les sièges pris aléatoirement (15%)
const siegesPris = getSiegesPris(NB_RANGES, NB_SIEGES, 0.15);

// Rangées normales
for (let row = 0; row < NB_RANGES; row++) {
  html += '<div class="rangee">';
  for (let seat = 1; seat <= NB_SIEGES; seat++) {
    const id = `${ALPHABET[row]}${seat}`;
    const priseClass = siegesPris.includes(id) ? "prise" : "libre";
    // Ajoute la classe 'decale' aux sièges A4 à M4 et A14 à M14 sur les 3 premières rangées
    let decaleClass = "";
    if (row < 13 && (seat === 4 || seat === 14)) {
      decaleClass = " decale";
    }
    html += `<span class="siege${decaleClass} ${priseClass}" data-id="${id}"></span>`;
  }
  html += "</div>";
}
html += "</div>";

// injection html de la légende et du bouton réservation
html += `<div class='legende'>
  <div class="gest-ecran">
    <div class="left"></div>
    <div class="ecran">Ecran</div>
    <div class="right"></div>
  </div>
  <div class="gestion-sieges">
    <img src="../Assets/Pictos/siege-vert.png" style="width:24px;"> Mes places
    <img src="../Assets/Pictos/siege-jaune.png" style="width:24px;"> Places libres
    <img src="../Assets/Pictos/siege-gris.png" style="width:24px;"> Places prises
    <span id="compteur-reservations">0 place réservée</span><br />
  </div>
  <button id="reserver-place">Réserver mes places <img src="../Assets/Pictos/fleche-droite.png" style="width:34px;height:34px;"></button>
  <span id="places-error" style="color:red;display:none;margin-left:10px;"></span>
  </div>`;

placesSection.innerHTML = html;
restorePlacesSelection();

// Ajout de la gestion du bouton réservation
const reserverBtn = document.getElementById("reserver-place");
const placesError = document.getElementById("places-error");

reserverBtn.addEventListener("click", function (e) {
  const selectionnes = document.querySelectorAll(".siege.selectionne");
  if (selectionnes.length === 0) {
    placesError.textContent = "Veuillez sélectionner au moins une place.";
    placesError.style.display = "inline";
    return;
  }
  // Sauvegarde le nombre de places sélectionnées
  localStorage.setItem("nbPlacesChoisies", selectionnes.length);
  placesError.style.display = "none";
  window.location.href = "../HTML/tarif.html";
});

// Gestion sélection des places
function updateCompteur() {
  const selectionnes = document.querySelectorAll(".siege.selectionne");
  const compteur = document.getElementById("compteur-reservations");

  if (selectionnes.length === 0) {
    compteur.textContent = "0 place réservée";
  } else {
    const positions = Array.from(selectionnes).map((s) => s.dataset.id);
    compteur.textContent = `${selectionnes.length} place${
      selectionnes.length > 1 ? "s" : ""
    } réservée${selectionnes.length > 1 ? "s" : ""} : ${positions.join(" , ")}`;
  }
}

function savePlacesSelection() {
  // Sauvegarde les places sélectionnées dans le localStorage
  const selectionnes = Array.from(
    document.querySelectorAll(".siege.selectionne")
  ).map((s) => s.dataset.id);
  localStorage.setItem("placesChoisies", JSON.stringify(selectionnes));
}

function saveFilmData(filmData) {
  // Sauvegarde les infos film dans le localStorage
  localStorage.setItem("filmData", JSON.stringify(filmData));
}

function restorePlacesSelection() {
  // Restaure les places sélectionnées depuis le localStorage
  const saved = JSON.parse(localStorage.getItem("placesChoisies") || "[]");
  saved.forEach((id) => {
    const siege = document.querySelector(`.siege[data-id='${id}']`);
    if (siege) {
      siege.classList.add("selectionne");
      siege.classList.remove("libre");
    }
  });
  updateCompteur();
}

document.querySelector(".salle").addEventListener("click", function (e) {
  const siege = e.target;
  if (!siege.classList.contains("siege")) return;
  if (siege.classList.contains("prise")) return;

  siege.classList.toggle("selectionne");
  siege.classList.toggle("libre");

  updateCompteur();
  savePlacesSelection();
});

updateCompteur();

// Infos film affichées
document.querySelector(".film").innerHTML = `
<div class="film-img">
  <img src="${image}" alt="${titre}" />
</div>
<div class="film-info">
  <div class="info-logo">
    <img src="../Assets/Pictos/logo-international-white 1.png" alt="Logo" />
  </div>
  <img src="${image}" alt="${titre}" class="film-couverture" />
  <h2>${titre}</h2>
  <button><a href="../HTML/presentation.html">Changer de film</a></button>
  <p>Séance : ${horaire} ${version}</p>
  <p class="finPrevu">${fin ? "Fin prévue : " + fin : ""}</p>
  <p class="film-salle">
    ${salle ? "Salle " + salle : ""}
    ${
      isHandicap
        ? '<img src="../Assets/Pictos/desactive-black.png" alt="Handicapé" style="width:20px;vertical-align:middle;" />'
        : ""
    }
  </p>
</div>
`;
