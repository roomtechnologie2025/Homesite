# RoomTech - Site Web Professionnel

Site web one-page professionnel pour RoomTech, entreprise de maintenance informatique à domicile.

## 🚀 Technologies utilisées

- **React 19** - Framework JavaScript
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS v4** - Framework CSS
- **Framer Motion** - Animations
- **React i18next** - Internationalisation (FR, EN, SO)
- **EmailJS** - Envoi d'emails depuis le frontend
- **Lucide React** - Icônes

## 📋 Prérequis

- Node.js 18+ et npm
- Compte EmailJS (gratuit, 200 emails/mois)

## 🛠️ Installation

1. **Cloner le projet** (ou télécharger)
   ```bash
   git clone <votre-repo>
   cd Homesite
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer EmailJS**
   - Suivez les instructions dans `EMAILJS_SETUP.md`
   - Créez un fichier `.env` à la racine avec :
     ```env
     VITE_EMAILJS_SERVICE_ID=votre_service_id
     VITE_EMAILJS_TEMPLATE_ID=votre_template_id
     VITE_EMAILJS_PUBLIC_KEY=votre_public_key
     ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

5. **Ouvrir dans le navigateur**
   - Le site sera accessible sur `http://localhost:5173`

## 📦 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code avec ESLint

## 🌐 Déploiement sur Vercel

1. **Connecter votre repository GitHub à Vercel**

2. **Ajouter les variables d'environnement** dans Vercel :
   - Settings > Environment Variables
   - Ajoutez :
     - `VITE_EMAILJS_SERVICE_ID`
     - `VITE_EMAILJS_TEMPLATE_ID`
     - `VITE_EMAILJS_PUBLIC_KEY`

3. **Déployer**
   - Vercel détectera automatiquement Vite
   - Le déploiement se fera automatiquement

## 📁 Structure du projet

```
Homesite/
├── public/              # Fichiers statiques
│   ├── blanc.jpg       # Logo mode clair
│   ├── noir.jpg        # Logo mode sombre
│   └── .htaccess       # Configuration Apache (routing SPA)
├── src/
│   ├── components/     # Composants React
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── News.jsx
│   │   ├── Blog.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── config/         # Configuration
│   │   └── emailjs.js  # Configuration EmailJS
│   ├── contexts/       # Contextes React
│   ├── hooks/          # Hooks personnalisés
│   ├── i18n/           # Traductions
│   │   ├── config.js
│   │   └── locales/
│   │       ├── fr.json
│   │       ├── en.json
│   │       └── so.json
│   ├── App.jsx         # Composant principal
│   ├── main.jsx        # Point d'entrée
│   └── index.css       # Styles globaux
├── .env                # Variables d'environnement (à créer)
├── vite.config.js      # Configuration Vite
└── package.json        # Dépendances
```

## 🎨 Fonctionnalités

- ✅ Site one-page avec navigation smooth scroll
- ✅ Mode sombre/clair avec persistance
- ✅ Multilingue (Français, Anglais, Somali)
- ✅ Formulaire de contact fonctionnel avec EmailJS
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Animations avec Framer Motion
- ✅ SEO optimisé

## 📧 Configuration EmailJS

Consultez `EMAILJS_SETUP.md` pour la configuration complète d'EmailJS.

## 🔧 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `src/index.css` :
- Jaune RoomTech : `#FFD700`
- Noir : `#000000`

### Traductions
Les traductions sont dans `src/i18n/locales/` :
- `fr.json` - Français
- `en.json` - Anglais
- `so.json` - Somali

## 📝 Licence

Propriétaire - RoomTech © 2025
