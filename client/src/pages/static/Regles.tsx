import "../../styles (anciennement CSS)/pages/Regles.css";

import badgePhone from "../../assets/images/badges/badge_phone.png";
import badgeCamera from "../../assets/images/badges/badge_camera.png";
import badgeNegative from "../../assets/images/badges/badge_negative.png";
import badgeRoller from "../../assets/images/badges/badge_roller.png";
import badgeSpaceship from "../../assets/images/badges/badge_spaceship.png";
import badgeSpray from "../../assets/images/badges/badge_spray.png";
import badgeEye from "../../assets/images/badges/badge_eye.png";
import arrowUp from "../../assets/images/arrow_up.png";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function Regles() {
  return (
    <>
      <div className="container_rules">
        <h1 id="firsttitle_rules">RÈGLES DU JEU</h1>
        <h2>Prêt·es à vivre l’aventure ?</h2>
        <p>Découvrez nos règles et rejoignez-nous !</p>
        <div className="instructions">
          <p id="intro_rules">
            Des règles simples pour une aventure inoubliable. Vous parcourez les
            rues comme un·e historien·ne moderne, redécouvrant les trésors
            cachés de nos villes. Des récompenses pour les contributeur·rices
            assidu·es, avec un classement officiel.
          </p>
        </div>
        <h3 className="thirdtitles_rules">Système de points</h3>
        <ul>
          <li>
            Soumission d'une œuvre avec photo et localisation valide :
            <div className="points01">50 points</div>
          </li>
          <li>
            Première soumission d'une œuvre dans une nouvelle ville/quartier :
            <div className="points01">100 points</div>
          </li>
          <li>
            Signalement d'une œuvre disparue (avec preuve) :
            <div className="points01">30 points</div>
          </li>
        </ul>
        <h3 className="thirdtitles_rules">Système de Badges</h3>
        <p>
          Les badges sont des récompenses visuelles qui sont attribués aux
          contributeur·rices.
        </p>
        <h4>Badges Contributeur·rices</h4>
        <ul className="badges_class">
          <li>
            <div className="badge">
              <h5>Badge Découvreur·euse Novice</h5>
            </div>
            <p>Soumettre 5 œuvres</p>
            <img src={badgePhone} alt="phone" className="badges_img" />
          </li>
          <li>
            <div className="badge">
              <h5>Badge Photographe de Rue</h5>
            </div>
            <p>Soumettre 20 œuvres</p>
            <img src={badgeCamera} alt="camera" className="badges_img" />
          </li>
          <li>
            <div className="badge">
              <h5>Badge Archiviste</h5>
            </div>
            <p>Soumettre 50 œuvres</p>
            <img src={badgeNegative} alt="negative" className="badges_img" />
          </li>
        </ul>
        <h4>Badges Voyageur·euses</h4>
        <ul className="badges_class">
          <li>
            <div className="badge">
              <h5>Badge Explorateur·rice Local·e</h5>
            </div>
            <p>Soumettre des œuvres dans 3 quartiers d'une même ville</p>
            <img src={badgeRoller} alt="roller_skate" className="badges_img" />
          </li>
          <li>
            <div className="badge">
              <h5>Globe-Trotteur·euse Urbain·e</h5>
            </div>
            <p>Soumettre des œuvres dans 2 villes différentes</p>
            <img src={badgeSpaceship} alt="spaceship" className="badges_img" />
          </li>
        </ul>
        <h4>Badges spéciaux</h4>
        <ul className="badges_class">
          <li>
            <div className="badge">
              <h5>Découverte Rare</h5>
            </div>
            <p>Soumettre une œuvre d'un·e artiste renommé·e</p>
            <img src={badgeSpray} alt="spray_paint" className="badges_img" />
          </li>
          <li>
            <div className="badge">
              <h5>Œil de Lynx</h5>
            </div>
            <p>Soumettre une œuvre difficile à localiser</p>
            <img src={badgeEye} alt="eye" className="badges_img" />
          </li>
        </ul>

        <h3 className="thirdtitles_rules">Niveaux</h3>
        <div className="niveaux">
          <p>
            Les niveaux permettent de suivre la progression globale des
            contributeurs en fonction du total de points accumulés. Plus vous
            aurez de points plus vous serez au sommet de la pyramide :
          </p>
        </div>
        <ul>
          <li>
            <h6>LEVEL 1</h6>
            <h5>Passant·e Curieux·se</h5>
            <div className="points02">
              <p>0-499 points</p>
            </div>
          </li>
          <li>
            <h6>LEVEL 2</h6>
            <h5>Apprenti·e Explorateur·rice</h5>
            <div className="points02">
              <p>500-999 points</p>
            </div>
          </li>
          <li>
            <h6>LEVEL 3</h6>
            <h5>Chercheur·euse Urbain·e</h5>
            <div className="points02">
              <p>1.000-2.499 points</p>
            </div>
          </li>
          <li>
            <h6>LEVEL 4</h6>
            <h5>Découvreur·euse Passionné·e</h5>
            <div className="points02">
              <p>2.500-4.999 points</p>
            </div>
          </li>
          <li>
            <h6>LEVEL 5</h6>
            <h5>Conservateur·rice de Rue</h5>
            <div className="points02">
              <p>5.000-9.999 points</p>
            </div>
          </li>
          <li>
            <h6>LEVEL 6</h6>
            <h5>Légende du Street Art</h5>
            <div className="points02">
              <p>10.000 points et +</p>
            </div>
          </li>
        </ul>
        <button type="button" id="button_up" onClick={scrollToTop}>
          <img src={arrowUp} alt="Retour_vers_le_haut" id="arrow_up" />
          <p>RETOUR VERS LE HAUT</p>
        </button>
      </div>
    </>
  );
}

export default Regles;
