# Configuration EmailJS pour RoomTech

## Étapes de configuration

### 1. Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (200 emails/mois)
3. Connectez-vous à votre compte

### 2. Configurer un service email

1. Dans le dashboard, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur d'email :
   - **Gmail** (recommandé pour commencer)
   - **Outlook**
   - **Yahoo**
   - Ou un service SMTP personnalisé
4. Suivez les instructions pour connecter votre compte email
5. **Notez le Service ID** (ex: `service_xxxxx`)

### 3. Créer un template d'email

1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce template HTML (collez-le dans l'éditeur) :

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f9fafb; padding:24px;">
  <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,0.1);">
    <tr>
      <td style="background:#000000; color:#FFD700; padding:24px 32px;">
        <h1 style="margin:0; font-size:24px; font-weight:700; color:#FFD700;">Nouveau message — Message de {{name}}</h1>
        <p style="margin:8px 0 0; font-size:14px; opacity:0.9; color:#FFD700;">Réception via le formulaire RoomTech</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 18px; color:#000000; font-size:16px; font-weight:600;">Bonjour,</p>
        <p style="margin:0 0 18px; color:#1f2937; font-size:16px; line-height:1.6;">Un nouveau message vient d'être reçu. Voici les informations transmises :</p>
        <div style="border:2px solid #FFD700; border-radius:12px; padding:18px 24px; background:#fffef5;">
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Nom :</strong> <span style="color:#1f2937;">{{name}}</span>
          </p>
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Email :</strong> <a href="mailto:{{email}}" style="color:#FFD700; text-decoration:none; font-weight:600;">{{email}}</a>
          </p>
          <p style="margin:0 0 12px; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Téléphone :</strong> <span style="color:#1f2937;">{{phone}}</span>
          </p>
          <p style="margin:0; font-size:15px; color:#000000;">
            <strong style="color:#FFD700;">Message :</strong><br />
            <span style="white-space:pre-line; color:#1f2937; margin-top:8px; display:block;">{{message}}</span>
          </p>
        </div>
        <p style="margin:24px 0 0; font-size:14px; color:#4b5563;">Merci de répondre sous 24h. À bientôt !</p>
      </td>
    </tr>
    <tr>
      <td style="background:#000000; padding:16px 32px; text-align:center;">
        <p style="margin:0; color:#FFD700; font-size:12px; font-weight:600;">© 2025 RoomTech — Tous droits réservés</p>
      </td>
    </tr>
  </table>
</div>
```

4. Configurez les champs du formulaire :
   - **To Email** : Votre email de réception (ex: `roomtechnologie2025@gmail.com`)
   - **From Name** : `RoomTech Contact Form`
   - **Reply To** : `{{email}}` (pour répondre directement au client)
   - **Subject** : `Nouveau message de {{name}} - RoomTech`

5. **Notez le Template ID** (ex: `template_xxxxx`)

### 4. Obtenir la clé publique

1. Allez dans **Account** > **General**
2. Trouvez la section **API Keys**
3. **Notez la Public Key** (ex: `xxxxxxxxxxxxx`)

### 5. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

**Important** : Sur Vercel, ajoutez ces variables dans :
- Settings > Environment Variables
- Ajoutez les 3 variables pour Production, Preview et Development

## Variables utilisées dans le code

- `{{name}}` - Nom du client
- `{{email}}` - Email du client
- `{{phone}}` - Téléphone du client (peut être vide)
- `{{message}}` - Message du client

## Test

Une fois configuré, testez le formulaire de contact sur votre site. Vous devriez recevoir un email avec le style RoomTech.

## Limites

- **Version gratuite** : 200 emails/mois
- **Version payante** : À partir de $15/mois pour plus d'emails

## Support

Pour plus d'aide, consultez la [documentation EmailJS](https://www.emailjs.com/docs/)

