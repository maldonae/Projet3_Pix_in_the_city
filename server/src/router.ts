import express from "express";
import multer from "multer";

const router = express.Router();

// imports des fichiers
import authActions from "./modules/auth/authActions";
import photoActions from "./modules/photo/photoActions";
import verifdata from "./modules/services/middleware/verifdata";
import userActions from "./modules/user/userActions";
import badgeActions from "./modules/badge/badgeActions"; // ✅ RESTAURÉ

// 🔒 CONFIGURATION MULTER SÉCURISÉE
const upload = multer({
  dest: "/var/www/server/public/photos/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
    files: 1, // 1 seul fichier
    fields: 10, // Limite les champs du formulaire
  },
  fileFilter: (req, file, cb) => {
    // ✅ Vérification du type MIME
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF.'));
    }
  }
});

// 🔒 MIDDLEWARE DE GESTION D'ERREURS MULTER
const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux. Taille maximum : 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Trop de fichiers. Maximum : 1 fichier'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Champ de fichier inattendu'
      });
    }
  }
  
  if (err.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({
      error: err.message
    });
  }
  
  next(err);
};

// 🔒 ROUTES UTILISATEUR - SÉCURISÉES
router.get("/api/users", authActions.verifyAuth, authActions.requireAdmin, userActions.browse);
router.get("/api/users/:id", authActions.verifyAuth, authActions.requireSelfOrAdmin, userActions.read);
router.get("/api/auth", authActions.verifyToken);
router.put("/api/users/:id", authActions.verifyAuth, authActions.requireSelfOrAdmin, userActions.edit);
router.delete("/api/users/:id", authActions.verifyAuth, authActions.requireSelfOrAdmin, userActions.destroy);

// applique le middleware uniquement pour la création d'un user (publique)
router.post(
  "/api/users",
  verifdata.verifyformdata,
  authActions.hashPassword,
  userActions.add,
);

// 🔒 ROUTES AUTH - PUBLIQUES
router.post("/api/login", authActions.login);
router.get("/api/logout", authActions.logout);

// 🔒 ROUTES PHOTOS - SÉCURISÉES AVEC LIMITE DE TAILLE
router.get("/api/photos", photoActions.browse); // Public
router.get("/api/photos/:id", photoActions.read); // Public

// ✅ UPLOAD SÉCURISÉ avec gestion d'erreurs
router.post("/api/photos", 
  authActions.verifyAuth,
  (req, res, next) => {
    upload.single("picture")(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  photoActions.add
);

router.delete("/api/photos/:id", authActions.verifyAuth, photoActions.destroy);

// 🏆 ROUTES BADGES - RESTAURÉES ET SÉCURISÉES
router.get("/api/badges", badgeActions.browse); // Public pour voir les badges disponibles

router.get("/api/users/:id/badges",
  authActions.verifyAuth,
  authActions.requireSelfOrAdmin,
  badgeActions.getUserBadges
); // User voit ses badges, admin voit tous

router.get("/api/users/:id/stats",
  authActions.verifyAuth,
  authActions.requireSelfOrAdmin,
  badgeActions.getUserStats
); // User voit ses stats, admin voit tous

router.get("/api/leaderboard", badgeActions.getLeaderboard); // Public

router.post("/api/users/:id/check-badges",
  authActions.verifyAuth,
  authActions.requireSelfOrAdmin,
  badgeActions.checkAndAwardBadges
); // User peut vérifier ses badges

export default router;
