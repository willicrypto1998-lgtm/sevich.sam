# Sevich Hair — Site E-commerce HTML/JS Pur

Site clone du Shopify Sevich Hair, fonctionne **sans serveur** — il suffit d'ouvrir `index.html` dans le navigateur.

## 🚀 Démarrage rapide

1. **Dézippez** le dossier `sevich-hair`
2. **Double-cliquez** sur `index.html` → le site s'ouvre dans votre navigateur
3. Pour le **panneau admin** : ouvrez `admin/login.html`
   - Identifiant : `admin`
   - Mot de passe : `admin123`
   - **⚠️ Changez le mot de passe immédiatement** depuis Settings

## 📁 Structure

```
sevich-hair/
├── index.html              # Page d'accueil
├── catalog.html            # Catalogue
├── product.html            # Page produit
├── checkout.html           # Commande (capture panier abandonné)
├── order-success.html      # Confirmation
├── contact.html            # Contact
├── admin/
│   ├── login.html          # Connexion admin
│   ├── index.html          # Dashboard
│   ├── orders.html         # Gestion commandes
│   ├── abandoned.html      # Paniers abandonnés
│   ├── products.html       # CRUD produits
│   ├── settings.html       # Configuration
│   └── admin.js            # Logique admin
├── assets/
│   ├── css/
│   │   ├── style.css       # CSS site
│   │   └── admin.css       # CSS admin
│   └── js/
│       ├── data.js         # Configuration & données
│       ├── reviews.js      # Avis fake déterministes
│       ├── cart.js         # Panier (limite 3)
│       └── layout.js       # Header, footer, Pixel
└── docs/
    ├── google-apps-script.gs       # Code à coller dans Apps Script
    └── google-sheets-setup.html    # Guide d'installation
```

## 🎯 Fonctionnalités

### Côté Client
- ✅ Catalogue produits avec galerie d'images
- ✅ Avis clients fake auto-générés (déterministes par produit, donc identiques à chaque visite)
- ✅ Panier avec **limite de 3 unités** au total (toutes confondues)
- ✅ Capture de panier abandonné dès que le client saisit son téléphone
- ✅ Checkout en 1 page avec choix de wilaya (58) + commune
- ✅ Paiement à la livraison (pas de paiement en ligne)
- ✅ Recherche produits
- ✅ Newsletter (envoi vers Google Sheets)
- ✅ Bouton WhatsApp flottant
- ✅ Design RTL arabe + responsive mobile

### Marketing
- ✅ **Facebook Pixel** : PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
- ✅ **Google Sheets** comme base de données cloud (optionnel mais recommandé)

### Admin Panel
- ✅ Dashboard avec statistiques (revenus, commandes, paniers abandonnés)
- ✅ Gestion des commandes (statut, détails, suppression)
- ✅ Gestion des paniers abandonnés (lien WhatsApp direct pour relance)
- ✅ CRUD produits complet (titre, prix, images, variantes, mémorisation)
- ✅ Settings : tagline, prix livraison (home/office), Pixel ID, webhook Sheets, mot de passe
- ✅ Export JSON de toutes les données
- ✅ Reset complet

## ⚙️ Configuration

### 1. Personnaliser le site
Allez dans `admin/settings.html` et modifiez :
- Nom du site, tagline (bandeau du haut)
- Numéro WhatsApp, email
- Prix livraison (domicile / bureau)
- Limite panier (par défaut 3)

### 2. Activer Facebook Pixel
1. Récupérez votre Pixel ID depuis [Meta Events Manager](https://business.facebook.com/events_manager)
2. Settings → Marketing → Facebook Pixel ID → collez l'ID
3. Sauvegardez

### 3. Connecter Google Sheets (recommandé)
Voir le guide complet dans `docs/google-sheets-setup.html` (s'ouvre dans le navigateur)

Résumé :
1. Créez un Google Sheet
2. Extensions → Apps Script → collez le code de `docs/google-apps-script.gs`
3. Deploy → New deployment → Web app → "Anyone"
4. Copiez l'URL `/exec`
5. Settings → collez l'URL → testez

Une fois connecté, **toutes les commandes, paniers abandonnés, newsletters, et messages contact** seront automatiquement synchronisés dans Google Sheets.

## 💾 Stockage des données

**Toutes les données sont stockées dans `localStorage` du navigateur** :
- `sevich_config` : configuration
- `sevich_products` : produits
- `sevich_orders` : commandes
- `sevich_abandoned` : paniers abandonnés
- `sevich_cart` : panier en cours
- `sevich_customer` : info client (pour panier abandonné)
- `sevich_admin_session` : session admin (24h)

⚠️ **Important** : Vider le cache du navigateur supprime toutes les données. C'est pour cela qu'il est **fortement recommandé de connecter Google Sheets** comme backup.

## 🌐 Hébergement

Comme c'est du HTML/JS pur, vous pouvez héberger le site sur :
- **Netlify** (gratuit, drag & drop du dossier)
- **Vercel** (gratuit)
- **GitHub Pages** (gratuit)
- **Cloudflare Pages** (gratuit)
- **OVH / cPanel** (FTP simple)

Aucun PHP, aucune base de données, aucun serveur Node nécessaire.

## 🛒 Limite 3 unités

Configurable depuis Settings (par défaut : 3 unités au total dans le panier toutes confondues). Le système empêche :
- L'ajout au-delà de la limite (avec message d'avertissement)
- La modification de quantité au-delà
- La validation de commande au-delà

## 📧 Avis fake déterministes

Les avis sont générés à partir d'un PRNG (mulberry32) seedé par l'ID du produit. Cela signifie :
- Le même produit aura toujours les **mêmes avis** à chaque visite
- 12 avis par produit (configurable dans Settings)
- Distribution réaliste : 70% 5★, 25% 4★, 5% 3★
- Noms algériens, villes, dates relatives, badges "vérifié"

## ❓ FAQ

**Q : Pourquoi `mode: 'no-cors'` dans les fetch vers Google Sheets ?**
R : Apps Script ne supporte pas CORS depuis un fichier `file://`. Le mode no-cors permet d'envoyer les données mais pas de lire la réponse. C'est suffisant car on veut juste écrire dans le Sheet.

**Q : Le client perd ses données ?**
R : Tant que le client ne vide pas son cache, ses données restent. Pour ne rien perdre : **connectez Google Sheets**. Toutes les commandes y seront sauvegardées.

**Q : Comment ajouter d'autres produits ?**
R : Admin → Products → "+ إضافة منتج"

**Q : Comment changer la couleur principale ?**
R : Modifiez les variables CSS dans `assets/css/style.css` (lignes 4-15).

---

**Sevich Hair** — Site E-commerce algérien | HTML/JS pur | Sans serveur
