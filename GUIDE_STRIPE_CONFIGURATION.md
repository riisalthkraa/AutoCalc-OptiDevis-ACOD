# 🚀 Guide Complet : Configuration Stripe + Paiement Automatique

## 📋 Vue d'ensemble

Ce guide te permettra de configurer un système de paiement automatique avec :
- ✅ Paiement sécurisé via Stripe
- ✅ Génération automatique de clés de licence
- ✅ Envoi automatique par email au client
- ✅ Historique des ventes

---

## ÉTAPE 1 : Configuration Stripe

### 1.1 Créer tes produits sur Stripe

1. Va sur ton dashboard Stripe : https://dashboard.stripe.com/
2. Va dans **Produits** > **Créer un produit**

**Produit 1 : Licence Standard**
- Nom : `AutoCalc OptiDevis - Licence Standard`
- Description : `Licence 1 poste - Toutes fonctionnalités - Mises à jour à vie`
- Prix : `99 EUR` (paiement unique)
- Copie le **Price ID** (commence par `price_...`)

**Produit 2 : Licence Pro**
- Nom : `AutoCalc OptiDevis - Licence Pro`
- Description : `Licence 5 postes - Formation incluse - Support prioritaire`
- Prix : `249 EUR` (paiement unique)
- Copie le **Price ID**

### 1.2 Récupérer tes clés API

1. Va dans **Développeurs** > **Clés API**
2. Copie ces deux clés :
   - **Clé publiable** (commence par `pk_test_...` ou `pk_live_...`)
   - **Clé secrète** (commence par `sk_test_...` ou `sk_live_...`)

⚠️ **IMPORTANT** : Ne JAMAIS partager ta clé secrète !

---

## ÉTAPE 2 : Configuration Email (Gmail)

### 2.1 Créer un mot de passe d'application Gmail

1. Va sur https://myaccount.google.com/security
2. Active l'authentification à 2 facteurs (si pas déjà fait)
3. Va dans **Mots de passe d'application**
4. Génère un mot de passe pour "AutoCalc OptiDevis"
5. **Copie ce mot de passe** (16 caractères)

### 2.2 Tes identifiants SMTP

- Host : `smtp.gmail.com`
- Port : `587`
- User : Ton email Gmail (ex: `Riisalth@hotmail.fr` si c'est Gmail)
- Password : Le mot de passe d'application généré

---

## ÉTAPE 3 : Déploiement sur Netlify

### 3.1 Créer un compte Netlify

1. Va sur https://www.netlify.com/
2. Inscris-toi (gratuit)
3. Connecte ton compte GitHub

### 3.2 Déployer ton site

1. Dans Netlify, clique **Add new site** > **Import an existing project**
2. Choisis **GitHub**
3. Sélectionne ton repo `AutoCalc.github.io-autocalc-optidevis`
4. Configuration :
   - Build command : (laisse vide)
   - Publish directory : `/`
5. Clique **Deploy site**

### 3.3 Configurer les variables d'environnement

1. Va dans **Site settings** > **Environment variables**
2. Ajoute ces variables :

```
STRIPE_SECRET_KEY = sk_test_XXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET = (on va le créer à l'étape 4)

SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = ton-email@gmail.com
SMTP_PASSWORD = ton-mot-de-passe-application
```

3. **Save**

---

## ÉTAPE 4 : Configuration du Webhook Stripe

### 4.1 Créer le webhook

1. Va sur Stripe Dashboard > **Développeurs** > **Webhooks**
2. Clique **Ajouter un endpoint**
3. URL du webhook : `https://TON-SITE.netlify.app/.netlify/functions/webhook`

   ⚠️ Remplace `TON-SITE` par l'URL que Netlify t'a donnée

4. Événements à écouter :
   - Sélectionne `checkout.session.completed`

5. Clique **Ajouter un endpoint**

6. **Copie le signing secret** (commence par `whsec_...`)

### 4.2 Ajouter le webhook secret à Netlify

1. Retourne sur Netlify > **Site settings** > **Environment variables**
2. Ajoute :
   ```
   STRIPE_WEBHOOK_SECRET = whsec_XXXXXXXXXXXXXXXX
   ```
3. **Save**

4. **Redéploie le site** :
   - Va dans **Deploys**
   - Clique **Trigger deploy** > **Deploy site**

---

## ÉTAPE 5 : Mettre à jour tarifs.html

### 5.1 Récupérer tes Price IDs

Tu dois avoir :
- Price ID Licence Standard : `price_XXXXX`
- Price ID Licence Pro : `price_YYYYY`

### 5.2 Modifier tarifs.html

Remplace les lignes 339 et 369 :

**AVANT (ligne 339)** :
```html
<a href="contact.html" class="btn btn-primary btn-lg">
    <i class="fas fa-shopping-cart"></i> Commander maintenant
</a>
```

**APRÈS (ligne 339)** :
```html
<button onclick="acheterLicence('price_XXXXX', 'Standard')" class="btn btn-primary btn-lg">
    <i class="fas fa-shopping-cart"></i> Commander maintenant
</button>
```

**AVANT (ligne 369)** :
```html
<a href="contact.html" class="btn btn-secondary btn-lg">
    <i class="fas fa-envelope"></i> Nous contacter
</a>
```

**APRÈS (ligne 369)** :
```html
<button onclick="acheterLicence('price_YYYYY', 'Pro')" class="btn btn-secondary btn-lg">
    <i class="fas fa-shopping-cart"></i> Commander maintenant
</button>
```

### 5.3 Ajouter le script de paiement

Juste avant la balise `</body>` dans tarifs.html (ligne ~585), ajoute :

```html
<script src="https://js.stripe.com/v3/"></script>
<script>
    // Remplace par ta clé PUBLIABLE Stripe
    const stripe = Stripe('pk_test_XXXXXXXXXXXXX');

    async function acheterLicence(priceId, licenseType) {
        try {
            // Afficher un loader
            const button = event.target;
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirection...';

            // Rediriger vers Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                lineItems: [{ price: priceId, quantity: 1 }],
                mode: 'payment',
                successUrl: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                cancelUrl: window.location.origin + '/tarifs.html',
                locale: 'fr'
            });

            if (error) {
                console.error('Erreur Stripe:', error);
                alert('Erreur lors de la redirection vers le paiement. Veuillez réessayer.');
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander maintenant';
            }
        } catch (err) {
            console.error('Erreur:', err);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    }
</script>
```

⚠️ **N'oublie pas de remplacer** :
- `pk_test_XXXXXXXXXXXXX` par ta vraie clé publiable Stripe
- `price_XXXXX` par ton vrai Price ID Standard
- `price_YYYYY` par ton vrai Price ID Pro

---

## ÉTAPE 6 : Tests

### 6.1 Activer le mode test Stripe

1. Sur Stripe Dashboard, vérifie que tu es en **mode Test**
2. Tu peux utiliser ces cartes de test :
   - **Succès** : `4242 4242 4242 4242`
   - **Échec** : `4000 0000 0000 0002`
   - Date d'expiration : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

### 6.2 Tester le paiement

1. Va sur ton site : `https://TON-SITE.netlify.app/tarifs.html`
2. Clique sur **Commander maintenant** (Licence Standard)
3. Entre tes infos :
   - Email : **TON-EMAIL-TEST@gmail.com**
   - Carte : `4242 4242 4242 4242`
   - Date : 12/25
   - CVC : 123
4. Clique **Payer**

### 6.3 Vérifications

✅ **Tu devrais être redirigé vers** : `/success.html`
✅ **Tu devrais recevoir un email** avec ta clé de licence
✅ **Sur Stripe Dashboard** : Tu vois le paiement dans "Paiements"
✅ **Dans les logs Netlify** : Vérifie que le webhook a bien fonctionné

---

## ÉTAPE 7 : Passer en production

### 7.1 Activer le mode Live sur Stripe

1. Va sur Stripe Dashboard
2. Bascule en **mode Live** (en haut à droite)
3. Récupère tes **nouvelles clés API** (Live)
4. Crée tes **produits en Live** (mêmes prix)
5. Crée un **nouveau webhook** avec la même URL

### 7.2 Mettre à jour les variables sur Netlify

Remplace sur Netlify :
- `STRIPE_SECRET_KEY` → Clé Live
- `STRIPE_WEBHOOK_SECRET` → Webhook Secret Live

Et dans `tarifs.html` :
- `pk_test_...` → `pk_live_...` (clé publiable Live)
- `price_test...` → `price_...` (Price IDs Live)

### 7.3 Redéployer

1. Upload les fichiers modifiés sur GitHub
2. Netlify redéploiera automatiquement
3. **C'est en ligne ! 🎉**

---

## 🎯 Structure finale des fichiers

```
site-internet/
├── api/
│   ├── generate-license.js    # Génération de clés
│   ├── webhook.js              # Webhook Stripe
│   └── create-checkout.js      # (optionnel)
├── css/
├── js/
├── images/
├── index.html
├── tarifs.html                 # Modifié avec paiement
├── success.html                # Page de confirmation
├── package.json
├── netlify.toml
└── GUIDE_STRIPE_CONFIGURATION.md (ce fichier)
```

---

## 🆘 Dépannage

### Le webhook ne se déclenche pas

1. Vérifie que l'URL du webhook est correcte
2. Va dans Netlify > **Functions** > Vérifie que `webhook` apparaît
3. Teste le webhook avec Stripe CLI :
   ```bash
   stripe trigger checkout.session.completed
   ```

### L'email n'est pas envoyé

1. Vérifie les variables d'environnement SMTP
2. Vérifie que le mot de passe d'application Gmail est correct
3. Regarde les logs Netlify : **Functions** > **webhook** > Logs

### Erreur "Price not found"

- Vérifie que tu utilises les bons Price IDs
- Vérifie que tu es en mode Test ou Live cohérent partout

---

## 📊 Suivre tes ventes

### Option 1 : Dashboard Stripe
- Va sur Stripe > **Paiements**
- Tu vois tous les paiements avec emails des clients

### Option 2 : Logs Netlify
- Va sur Netlify > **Functions** > **webhook**
- Clique sur chaque invocation pour voir les détails

### Option 3 : Intégrer une base de données
- Tu peux modifier `webhook.js` pour sauvegarder dans :
  - Google Sheets (via API)
  - Airtable
  - Supabase
  - MongoDB Atlas

---

## 🎉 Félicitations !

Tu as maintenant un système de vente automatisé complet :
- ✅ Paiement sécurisé
- ✅ Génération automatique de clés
- ✅ Envoi automatique par email
- ✅ Pages de confirmation professionnelles

**Besoin d'aide ?**
- Email : Riisalth@hotmail.fr
- Documentation Stripe : https://stripe.com/docs
- Documentation Netlify : https://docs.netlify.com/

---

## 📝 Checklist finale

Avant de lancer en production :

- [ ] Compte Stripe créé et vérifié
- [ ] Produits créés sur Stripe (Standard + Pro)
- [ ] Clés API Stripe récupérées (publiable + secrète)
- [ ] Mot de passe d'application Gmail généré
- [ ] Site déployé sur Netlify
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Webhook Stripe créé et configuré
- [ ] tarifs.html modifié avec les Price IDs et la clé publiable
- [ ] Test réussi en mode Test
- [ ] Email de test reçu avec clé valide
- [ ] Basculé en mode Live
- [ ] Test final en mode Live avec vraie carte
- [ ] 🚀 **C'est en ligne !**
