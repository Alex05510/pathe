//Charger les données film
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

//  Afficher le film
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
      <p>Séances : ${filmData.horaire}${filmData.vf ? " (VF)" : " (VO)"}</p>
      <p class="finPrevu">${
        filmData.fin ? "Fin prévue : " + filmData.fin : ""
      }</p>
    </div>
  `;
}

// Afficher le paiement
function renderPayment(filmData, totalSnack) {
  document.getElementById("payment").innerHTML = `
    <p class="film-salle">Salle ${filmData.salle} ${
    filmData.handicap
      ? '<img src="../Assets/Pictos/desactive-black.png" alt="Handicapé" style="width:20px;vertical-align:middle;" />'
      : ""
  }</p>
    <h2>Paiement sécurisé</h2>
    <div class="payment-container">
      <h4>Choisir mon mode de paiement</h4>

      <div class="accordion">
        <button class="accordion-header">Carte bancaire</button>
        <div class="accordion-content">
          <div class="paiement-container">
            <div class="form-payment">
              <div class="carte">
                <p>Carte bancaire</p>
              </div>
              <div class="imgcarte">
                <img src="../Assets/Pictos/paiement/visa.png" alt="visa" style="width: 30px; height: 30px;"/>
                <img src="../Assets/Pictos/paiement/master.png" alt="mastercard" style="width: 50px; height: 30px;"/>
                <img src="../Assets/Pictos/paiement/amex.png" alt="amex" style="width: 30px; height: 30px;"/>
              </div>
            </div>
            <label for="card-number">Numéro de carte</label><br />
            <input type="text" id="card-number" placeholder="Numéro de carte" /><br />
            <div class="input-container">
              <div class="label-date">
                <label for="expiry-date">Date d'expiration</label><br />
                <input type="text" id="expiry-date" placeholder="MM/AA" /><br />
              </div>
              <div class="label-cvc">
                <label for="cvc">Cryptogramme</label><br />
                <input type="text" id="cvc" placeholder="CVC" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion">
        <button class="accordion-header">Google Pay</button>
        <div class="accordion-content">
          <div class="google-pay">
            <p>Google Pay</p>
            <img src="../Assets/Pictos/paiement/google-pay.png" alt="Google Pay" style="width: 50px; height: 50px;"/>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelector(
    ".panier-total"
  ).innerHTML = `Total à régler : <span>${totalSnack} €</span>`;
}

// Accordéon
function setupAccordion() {
  document.querySelectorAll(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.classList.toggle("open");

      // Fermer les autres accordéons
      document.querySelectorAll(".accordion-content").forEach((c) => {
        if (c !== content) c.classList.remove("open");
      });
    });
  });
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  const filmData = loadFilmData();
  const totalSnack = localStorage.getItem("totalSnack") || "0.00";

  renderFilm(filmData);
  renderPayment(filmData, totalSnack);
  setupAccordion();
});
