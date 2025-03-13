create table user (
  id int unsigned primary key auto_increment not null,
  firstname varchar(255) not null,
  lastname varchar(255) not null,
  pseudo VARCHAR(20) NOT NULL,
  email VARCHAR(50) NOT NULL,
  zip_code INT NULL,
  city VARCHAR(30) NULL,
  hashed_password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  is_gcu_accepted BOOL NOT NULL DEFAULT FALSE,
  is_admin boolean not null default false
);

CREATE TABLE photo (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  artist VARCHAR(255),
  dateoftheday DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latitude FLOAT NOT NULL DEFAULT 45.7597,  -- Latitude par défaut (centre de Lyon)
  longitude FLOAT NOT NULL DEFAULT 4.8422, -- Longitude par défaut (centre de Lyon)
  picture VARCHAR(255) NOT NULL,
  user_id INT UNSIGNED NULL, -- A CHANGER QUAND ON AURA FAIT L'AUTHENTIFICATION Clé étrangère liée à user.id
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL -- Contrainte de clé étrangère
);

ALTER TABLE user
DROP COLUMN avatar;

-- Ajout de user_id dans la table photo :

-- Colonne définie comme INT UNSIGNED NOT NULL.
-- Contrainte de clé étrangère ajoutée avec FOREIGN KEY (user_id) REFERENCES user(id).
-- Ajout de user_id dans les insertions des photos :

-- Chaque photo est associée à un utilisateur via son id.
-- Utilisation de ON DELETE CASCADE :

-- Permet de supprimer automatiquement les photos associées lorsqu'un utilisateur est supprimé.
-- Correction de l'ordre d'exécution :

-- La table user est créée avant la table photo.

insert into user(firstname, lastname, pseudo, email, zip_code, city, hashed_password, is_gcu_accepted, is_admin)
values
  ("Jacqueline", "Morin", "jijimomo_95", "jacquelinecomptabilite@sah.fr", "69001", "Lyon", "ilovecomptabilite", TRUE, TRUE),
  ("René", "Pichard", "pich-art", "rene_pich-art@sah.fr", "69002", "Lyon", "rene_explorateur", TRUE, FALSE),
  ("Pépito", "Perez", "pepito_roi_du_gateau", "p-p@sah.fr", "69003", "Lyon" ,"perezforever", TRUE, FALSE);

insert into photo(title, content, picture, latitude, longitude, artist, user_id)
values
-- Soumission photo de Jacqueline (id:1) (1 photo seulement):
  ("Mosaique Ememem, rue de la bourse, Lyon 2e", 
   "À partir de petit carreaux, l'artiste urban Ememem construit des mosaïques ou des 'pancements de trous' (comme il les appelle) pour vêtir la rue des couleurs. Dans ce mosaïque en blanc et noir nous trouvons une sorte de jeu qui fait penser aux mots fléchés. Pour connaître plus sur cet artiste, rdv dans son site web : https://www.ememem-flacking.com/ et sur ses réseaux sociaux.", 
   "Ememem.jpg", 45.754856958728, 4.842333829398,"Jeronimo", 1),

-- Soumission photo de Pépito (id:3) (3 photos):
  ("Hommage à Keith Haring, pont Morand, Lyon 1er", 
   "Dans le cadre de la Boucle du Ruban Rouge et de la Conférence du Fonds Mondial de lutte contre le sida qui s'est déroulé à Lyon les 9 et 10 octobre 2019, (RED) et la Métropole se sont associés pour développer une campagne de Street Art. 'Pour cette œuvre, Faile rend hommage à Keith Haring, artiste légendaire, activement engagé dans la lutte contre le sida, révélé aux Lyonnais lors d’une rétrospective présentée en 2008, au Musée d’Art Contemporain'", 
   "faile-morand.jpg", 45.7686161, 4.8395737,"Gertrude", 3),
  ("Vol du Ara, Kalouf et Chopper, rue Villon, Lyon 8ème", 
   "« L’œuvre représente le symbole de liberté au travers de ce ARA vert (ARA MILITARIS). L’espèce est menacée d’extinction à l’état sauvage à cause de son plumage vivement coloré et victime du trafic d’animaux. Il est souhaitable pour les générations futures que nous préservions le vivant. Les oiseaux jouent un rôle très important et sont indispensables pour la vie sur terre. Laisse la nature intacte, n’y prends rien sauf une photo. » KALOUF", 
   "kalouf-fresque.jpg", 45.7407144, 4.863946,"Bernard", 3),
  ("Titre inconnu", 
   "Cette oeuvre représente une petite fille chevauchant un lion", 
   "collage-britt_tam.jpg", 45.7692362, 4.8320104,"Bitt Tam", 3);
   

  

