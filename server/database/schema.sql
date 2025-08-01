-- ======================================
-- ORDRE CORRIGÉ : TABLES PARENTS D'ABORD
-- ======================================

-- 1. Table des niveaux (TABLE PARENT - doit être créée en premier)
CREATE TABLE level (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    min_points INT NOT NULL,
    max_points INT NOT NULL,
    icon VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL, -- code couleur hex
    description TEXT
);

-- 2. Table des utilisateurs (sans FK pour l'instant)
CREATE TABLE user (
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

-- 3. Table des badges disponibles
CREATE TABLE badge (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255) NOT NULL, -- nom du fichier icône
    category ENUM('discovery', 'photography', 'social', 'exploration', 'special') NOT NULL,
    condition_type ENUM('photo_count', 'discovery_count', 'artist_count', 'location_count', 'special_action') NOT NULL,
    condition_value INT NOT NULL, -- valeur seuil pour obtenir le badge
    points INT NOT NULL DEFAULT 10, -- points XP donnés par ce badge
    is_rare BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table des photos (avec FK vers user)
CREATE TABLE photo (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  artist VARCHAR(255),
  dateoftheday DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latitude FLOAT NOT NULL DEFAULT 45.7597,  -- Latitude par défaut (centre de Lyon)
  longitude FLOAT NOT NULL DEFAULT 4.8422, -- Longitude par défaut (centre de Lyon)
  picture VARCHAR(255) NOT NULL,
  user_id INT UNSIGNED NULL, -- Clé étrangère liée à user.id
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL -- Contrainte de clé étrangère
);

-- 5. Table des badges obtenus par les utilisateurs (avec FK vers user et badge)
CREATE TABLE user_badge (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    badge_id INT UNSIGNED NOT NULL,
    earned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badge(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_badge (user_id, badge_id)
);

-- ======================================
-- DONNÉES INITIALES (AVANT LES ALTER)
-- ======================================

-- Insertion des niveaux de base (OBLIGATOIRE AVANT ALTER TABLE user)
INSERT INTO level (name, min_points, max_points, icon, color, description) VALUES
('Novice', 0, 49, 'novice.svg', '#8B4513', 'Premier pas dans le monde du street art lyonnais'),
('Explorateur', 50, 149, 'explorer.svg', '#4682B4', 'Commence à découvrir les rues de Lyon'),
('Chasseur', 150, 349, 'hunter.svg', '#32CD32', 'Chasseur actif de street art urbain'),
('Expert', 350, 699, 'expert.svg', '#FF6347', 'Expert en art urbain lyonnais'),
('Maître', 700, 1299, 'master.svg', '#9370DB', 'Maître de l\'art urbain'),
('Légende', 1300, 999999, 'legend.svg', '#FFD700', 'Légende vivante du street art lyonnais');

-- Insertion des badges spécifiques à Street Art Hunter
INSERT INTO badge (name, description, icon, category, condition_type, condition_value, points, is_rare) VALUES
-- Badges de découverte
('Premier Regard', 'Publier votre première photo de street art', 'first_photo.svg', 'discovery', 'photo_count', 1, 10, FALSE),
('Collectionneur', 'Publier 10 photos de street art', 'collector.svg', 'discovery', 'photo_count', 10, 25, FALSE),
('Archiviste', 'Publier 50 photos de street art', 'archivist.svg', 'discovery', 'photo_count', 50, 50, TRUE),
('Documentariste', 'Publier 100 photos de street art', 'documentarist.svg', 'discovery', 'photo_count', 100, 100, TRUE),

-- Badges d'exploration de Lyon
('Explorateur Local', 'Découvrir 3 arrondissements différents de Lyon', 'local_explorer.svg', 'exploration', 'location_count', 3, 15, FALSE),
('Nomade Urbain', 'Découvrir 5 arrondissements différents de Lyon', 'urban_nomad.svg', 'exploration', 'location_count', 5, 30, FALSE),
('Maître des Rues', 'Découvrir tous les arrondissements de Lyon', 'street_master.svg', 'exploration', 'location_count', 9, 75, TRUE),

-- Badges d'artistes (basés sur vos données: Jeronimo, Gertrude, Bernard, etc.)
('Découvreur d\'Artistes', 'Photographier 3 artistes différents', 'artist_finder.svg', 'photography', 'artist_count', 3, 20, FALSE),
('Connaisseur', 'Photographier 5 artistes différents', 'connoisseur.svg', 'photography', 'artist_count', 5, 40, FALSE),
('Expert en Art Urbain', 'Photographier 10 artistes différents', 'urban_expert.svg', 'photography', 'artist_count', 10, 80, TRUE),

-- Badges spéciaux pour Street Art Hunter
('Hunter Vétéran', 'Membre depuis plus d\'un an', 'veteran.svg', 'special', 'special_action', 365, 50, TRUE),
('Ambassadeur de Lyon', 'Badge spécial réservé aux contributeurs exceptionnels', 'ambassador.svg', 'special', 'special_action', 0, 200, TRUE),
('Fan d\'Ememem', 'Découvrir une œuvre d\'Ememem à Lyon', 'ememem_fan.svg', 'special', 'special_action', 1, 30, FALSE);

-- Insertion des utilisateurs de test (vos données existantes)
insert into user(firstname, lastname, pseudo, email, zip_code, city, hashed_password, is_gcu_accepted, is_admin)
values
  ("Jacqueline", "Morin", "jijimomo_95", "jacquelinecomptabilite@sah.fr", "69001", "Lyon", "ilovecomptabilite", TRUE, TRUE),
  ("René", "Pichard", "pich-art", "rene_pich-art@sah.fr", "69002", "Lyon", "rene_explorateur", TRUE, FALSE),
  ("Pépito", "Perez", "pepito_roi_du_gateau", "p-p@sah.fr", "69003", "Lyon" ,"perezforever", TRUE, FALSE);

-- ======================================
-- MODIFICATIONS DE STRUCTURE (APRÈS DONNÉES)
-- ======================================

-- Suppression de la colonne avatar
ALTER TABLE user DROP COLUMN avatar;

-- Extension de la table user existante (ajout de colonnes pour badges/niveaux)
-- MAINTENANT level existe et contient des données, donc la FK peut être créée
ALTER TABLE user
ADD COLUMN role VARCHAR(50) DEFAULT 'user' AFTER is_admin,
ADD COLUMN total_points INT NOT NULL DEFAULT 0,
ADD COLUMN current_level_id INT UNSIGNED DEFAULT 1,
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD FOREIGN KEY (current_level_id) REFERENCES level(id);

-- ======================================
-- DONNÉES DE TEST
-- ======================================

-- Insertion des photos de test (vos données existantes)
insert into photo(title, content, picture, latitude, longitude, artist, user_id)
values
-- Soumission photo de Jacqueline (id:1) (1 photo seulement):
  ("Mosaique Ememem, rue de la bourse, Lyon 2e",
   "À partir de petit carreaux, l'artiste urban Ememem construit des mosaïques ou des 'pancements de trous' (comme il les appelle) pour vêtir la rue des couleurs. Dans ce mosaïque en blanc et noir nous trouvons une sorte de jeu qui fait penser aux mots fléchés. Pour connaître plus sur cet artiste, rdv dans son site web : https://www.ememem-flacking.com/ et sur ses réseaux sociaux.",
   "Ememem.jpg", 45.754856958728, 4.842333829398,"Jeronimo", 1),

-- Soumission photo de Pépito (id:3) (3 photos):
  ("Hommage à Keith Haring, pont Morand, Lyon 1er",
   "Dans le cadre de la Boucle du Ruban Rouge et de la Conférence du Fonds Mondial de lutte contre le sida qui s'est déroulé à Lyon les 9 et 10 octobre 2019, (RED) et la Métropole se sont associés pour développer une campagne de Street Art. 'Pour cette œuvre, Faile rend hommage à Keith Haring, artiste légendaire, activement engagé dans la lutte contre le sida, révélé aux Lyonnais lors d'une rétrospective présentée en 2008, au Musée d'Art Contemporain'",
   "faile-morand.jpg", 45.7686161, 4.8395737,"Gertrude", 3),
  ("Vol du Ara, Kalouf et Chopper, rue Villon, Lyon 8ème",
   "« L'œuvre représente le symbole de liberté au travers de ce ARA vert (ARA MILITARIS). L'espèce est menacée d'extinction à l'état sauvage à cause de son plumage vivement coloré et victime du trafic d'animaux. Il est souhaitable pour les générations futures que nous préservions le vivant. Les oiseaux jouent un rôle très important et sont indispensables pour la vie sur terre. Laisse la nature intacte, n'y prends rien sauf une photo. » KALOUF",
   "kalouf-fresque.jpg", 45.7407144, 4.863946,"Bernard", 3),
  ("Titre inconnu",
   "Cette oeuvre représente une petite fille chevauchant un lion",
   "collage-britt_tam.jpg", 45.7692362, 4.8320104,"Bitt Tam", 3);

-- Vue pour les statistiques utilisateur optimisée
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.pseudo,
    u.firstname,
    u.lastname,
    u.total_points,
    l.name as level_name,
    l.color as level_color,
    l.icon as level_icon,
    COUNT(DISTINCT p.id) as total_photos,
    COUNT(DISTINCT ub.badge_id) as total_badges,
    COUNT(DISTINCT p.artist) as unique_artists,
    COUNT(DISTINCT CONCAT(
        CASE 
            WHEN p.latitude BETWEEN 45.754 AND 45.764 AND p.longitude BETWEEN 4.830 AND 4.850 THEN '69001'
            WHEN p.latitude BETWEEN 45.750 AND 45.760 AND p.longitude BETWEEN 4.825 AND 4.845 THEN '69002'
            WHEN p.latitude BETWEEN 45.745 AND 45.755 AND p.longitude BETWEEN 4.840 AND 4.860 THEN '69003'
            WHEN p.latitude BETWEEN 45.765 AND 45.775 AND p.longitude BETWEEN 4.835 AND 4.855 THEN '69004'
            WHEN p.latitude BETWEEN 45.755 AND 45.765 AND p.longitude BETWEEN 4.845 AND 4.865 THEN '69005'
            WHEN p.latitude BETWEEN 45.760 AND 45.770 AND p.longitude BETWEEN 4.850 AND 4.870 THEN '69006'
            WHEN p.latitude BETWEEN 45.740 AND 45.750 AND p.longitude BETWEEN 4.840 AND 4.860 THEN '69007'
            WHEN p.latitude BETWEEN 45.735 AND 45.745 AND p.longitude BETWEEN 4.855 AND 4.875 THEN '69008'
            WHEN p.latitude BETWEEN 45.770 AND 45.780 AND p.longitude BETWEEN 4.800 AND 4.820 THEN '69009'
            ELSE 'autre'
        END
    )) as unique_locations,
    u.created_at as member_since
FROM user u
LEFT JOIN level l ON u.current_level_id = l.id
LEFT JOIN photo p ON u.id = p.user_id
LEFT JOIN user_badge ub ON u.id = ub.user_id
GROUP BY u.id, u.pseudo, u.firstname, u.lastname, u.total_points, l.name, l.color, l.icon, u.created_at;

-- ======================================
-- ATTRIBUTION AUTOMATIQUE DES BADGES
-- ======================================

-- Attribution automatique des badges aux utilisateurs existants
-- (à exécuter après l'insertion des badges)

-- Jacqueline (1 photo) -> Badge "Premier Regard"
INSERT INTO user_badge (user_id, badge_id) 
SELECT 1, id FROM badge WHERE name = 'Premier Regard';

-- Pépito (3 photos, 3 artistes) -> Badges "Premier Regard", "Découvreur d'Artistes"
INSERT INTO user_badge (user_id, badge_id) 
SELECT 3, id FROM badge WHERE name IN ('Premier Regard', 'Découvreur d\'Artistes');

-- Attribution des points aux utilisateurs existants
UPDATE user SET total_points = 10 WHERE id = 1; -- Jacqueline: 1 badge = 10 points
UPDATE user SET total_points = 30 WHERE id = 3; -- Pépito: 2 badges = 30 points

-- Mise à jour des niveaux (tous restent Novice avec ces points)
UPDATE user SET current_level_id = 1;