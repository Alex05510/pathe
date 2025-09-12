document.addEventListener("DOMContentLoaded", function () {
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
  const places = JSON.parse(localStorage.getItem("placesChoisies") || "[]");
  const totalSnack = parseFloat(localStorage.getItem("totalSnack")) || 0;
  const tarifs = JSON.parse(localStorage.getItem("tarifs")) || {};
  let totalTarif = 0;
  Object.values(tarifs).forEach((item) => {
    if (item.qty > 0) {
      totalTarif += item.prix * item.qty;
    }
  });
  const total = totalSnack.toFixed(2);

  document.querySelector(".film").innerHTML = `
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
  <p>Séances : ${filmData.horaire} ${filmData.version}</p>
  <p class="finPrevu">${filmData.fin ? "Fin prévue : " + filmData.fin : ""}</p>
</div>
`;

  document.getElementById("recap-seance").innerHTML = `
    <h4>Pathé Lyon Bellecour</h4>
    <h2><strong>Titre :</strong> ${filmData.titre}</h2>
    <p><strong>Séance :</strong> ${filmData.horaire} ${filmData.version}</p>
    <p><strong>Salle :</strong> ${filmData.salle}</p>
    <p><strong>Sièges :</strong> ${places.join(", ")}</p>
    <p><strong>Total :</strong> ${total} €</p>
    <img src="../Assets/Pictos/qr-code.png" alt="logo de qr code place de cinéma" class="qrCode" />
  `;
});
