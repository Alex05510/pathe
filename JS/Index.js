// la modale pour la bande-annonce
document.addEventListener("DOMContentLoaded", function () {
  if (!document.getElementById("modal-trailer")) {
    const modal = document.createElement("div");
    modal.id = "modal-trailer";
    modal.style =
      "display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:1000;";
    modal.innerHTML = `
      <div style="position:relative; margin:5% auto; width:80%; max-width:700px; background:#fff; border-radius:8px; padding:1rem;">
        <span id="close-modal" style="position:absolute; top:10px; right:20px; font-size:2rem; cursor:pointer;">&times;</span>
        <div id="trailer-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modal = document.getElementById("modal-trailer");
  const trailerContent = document.getElementById("trailer-content");
  const closeModal = document.getElementById("close-modal");

  // Fermer la modale
  function closeTrailer() {
    modal.style.display = "none";
    trailerContent.innerHTML = "";
  }
  closeModal.onclick = closeTrailer;

  // URL des film pour la bande-annonce dans modale
  const trailers = {
    Evanouis: "https://www.youtube.com/embed/EekFYCmo0eU",
    "Karate Kid: Legends": "https://www.youtube.com/embed/kcpKSKKpBag",
    "Nobody 2": "https://www.youtube.com/embed/qYgosdqMxDc",
    "Y a-t-il un flic pour sauver le monde ?":
      "https://www.youtube.com/embed/jWnO6T9Opgs",
    "Le monde de Wishy": "https://www.youtube.com/embed/uKGTukZ4Pe8",
  };

  // le slider automatique page index
  const slides = document.querySelectorAll(".slider .slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 3000);
  /*-------------------------------------*/
  // les films à l'affiche via le JSON
  fetch("../Assets/films_complet.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("films-container");

      data.forEach((film) => {
        const filmDiv = document.createElement("div");
        filmDiv.className = "film";
        filmDiv.setAttribute("data-film-id", film.id || film.titre);

        filmDiv.addEventListener("click", function () {
          localStorage.setItem(
            "filmChoisi",
            JSON.stringify({
              id: film.id || film.titre,
              titre: film.titre,
              image: film.image,
              horaire: film.séances ? film.séances.join(", ") : "",
            })
          );
        });

        filmDiv.innerHTML = `
          <div class="info">
            <div class="contenu-film">
              <div class="img">
                <img src="../Assets/Images/Films/${film.image}" alt="${
          film.titre
        }" />
              </div>
              <div class="info-text">
                ${film.nouveau ? '<span class="nouveau">Nouveau</span>' : ""}
                ${
                  film.mention_frisson
                    ? '<span class="frisson">Frisson</span>'
                    : ""
                }
                <h2>${film.titre}</h2>
                <div class="genres">
                  ${film.genre
                    .map((g) => `<span class="genre">${g}</span>`)
                    .join(" ")}
                  ${
                    film.durée_minutes
                      ? // conversion de minutes en heures et minutes
                        `<span class="duree">(${Math.floor(
                          film.durée_minutes / 60
                        )}h${
                          film.durée_minutes % 60 ? film.durée_minutes % 60 : ""
                        })</span>`
                      : ""
                  }
                  ${
                    /* les pictos rond a coté de la durée du film */
                    film.âge_minimum
                      ? `<span class="age">-${film.âge_minimum}</span>`
                      : ""
                  }
                  ${
                    film.avertissement_violence
                      ? '<span class="violence">!</span>'
                      : ""
                  }
                </div>
              </div>
            </div>
            <div class="horaires">
            ${/*les boutons des horaires avec les options */ ""}
              ${film.séances
                .map(
                  (s) => `
                <button class="btn-hover">
                  ${s.imax ? "IMAX<br>" : ""}
                  ${s["4D"] ? "4DX<br>" : ""}
                  ${s.horaire}
                  ${s.vf ? " VF" : ""}
                  ${s.vost ? " VOST" : ""}
                  ${s["4k"] ? " 4K" : ""}
                  ${
                    s.handicap
                      ? '<span title="Accessible handicapé"><img src="../Assets/Pictos/desactive-white.png" style="width:20px;height:20px;" alt="Accessible" /></span>'
                      : ""
                  }
                  <span class="circle"></span>
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `;

        container.appendChild(filmDiv);

        // Clic sur l’image pour la bande-annonce
        const imgEl = filmDiv.querySelector(".img img");
        imgEl.addEventListener("click", function (e) {
          e.stopPropagation();
          const titre = filmDiv.querySelector("h2").textContent.trim();
          const url = trailers[titre];
          trailerContent.innerHTML = url
            ? `<iframe width='100%' height='400' src='${url}' frameborder='0' allowfullscreen></iframe>`
            : `<p style='text-align:center'>Aucune bande-annonce disponible pour ce film.</p>`;
          modal.style.display = "block";
        });
      });

      // Clic sur les horaires
      document.querySelectorAll(".horaires button").forEach((btn) => {
        btn.addEventListener("click", function () {
          const filmDiv = btn.closest(".film");
          const titre = filmDiv.querySelector("h2").textContent;
          const image = filmDiv.querySelector("img").src;
          const horaire = btn.textContent.trim();
          const filmData = data.find((f) => f.titre === titre);

          let seanceLibre = 0,
            salleNum = "",
            seanceObj = null;
          if (filmData) {
            seanceObj = filmData.séances.find((s) =>
              horaire.includes(s.horaire)
            );
            if (seanceObj) {
              seanceLibre = seanceObj.libres;
              salleNum = seanceObj.salle;
            }
          }

          // Stockage complet des infos de séance dans le localStorage
          const filmDataToStore = {
            id: filmData.id || filmData.titre,
            titre: filmData.titre,
            image,
            horaire: seanceObj ? seanceObj.horaire : horaire,
            fin: seanceObj ? seanceObj.fin : "",
            version: seanceObj
              ? seanceObj.vf
                ? "VF"
                : seanceObj.vost
                ? "VOST"
                : ""
              : "",
            salle: salleNum,
            handicap: seanceObj ? seanceObj.handicap : false,
            libres: seanceLibre,
            seance: seanceObj,
            seances: filmData.séances,
          };
          localStorage.setItem("filmData", JSON.stringify(filmDataToStore));
          window.location.href = "../HTML/places.html";
        });
      });

      // filtres de recherche
      const searchInput = document.getElementById("search-input");
      const genreSelect = document.getElementById("genre-select");
      const btn4k = document.getElementById("btn-4k");
      const langueSelect = document.getElementById("langue-select");

      function simpleFilter() {
        const searchValue = searchInput.value.toLowerCase();
        const genreValue = genreSelect.value;
        const langueValue = langueSelect.value;
        const is4k = btn4k.classList.contains("active");

        document.querySelectorAll(".film").forEach((filmDiv) => {
          const titre = filmDiv.querySelector("h2").textContent.toLowerCase();
          const genres = [...filmDiv.querySelectorAll(".genre")].map(
            (e) => e.textContent
          );
          const horaires = [...filmDiv.querySelectorAll("button")].map(
            (e) => e.textContent
          );

          let show = true;
          if (searchValue && !titre.includes(searchValue)) show = false;
          if (genreValue && !genres.includes(genreValue)) show = false;
          if (langueValue && !horaires.some((h) => h.includes(langueValue)))
            show = false;
          if (is4k && !horaires.some((h) => h.includes("4K"))) show = false;

          filmDiv.style.display = show ? "" : "none";
        });
      }

      searchInput.addEventListener("input", simpleFilter);
      genreSelect.addEventListener("change", simpleFilter);
      langueSelect.addEventListener("change", simpleFilter);
      btn4k.addEventListener("click", function () {
        // ajoute la class active au btn 4k et change son style
        btn4k.classList.toggle("active");
        btn4k.style.backgroundColor = btn4k.classList.contains("active")
          ? "#ffcc00"
          : "";
        btn4k.style.color = btn4k.classList.contains("active") ? "#000" : "";
        simpleFilter();
      });
    });
  document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".btn-hover").forEach((btn) => {
      const circle = btn.querySelector(".circle");
      const rect = btn.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      circle.style.top = `${y}px`;
      circle.style.left = `${x}px`;
    });
  });
  // bouton pour le retours en haut de page
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
