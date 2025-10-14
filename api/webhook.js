/**
 * Webhook Stripe pour AutoCalc OptiDevis
 * Gère les paiements réussis et envoie automatiquement les clés de licence
 *
 * Compatible avec : Netlify Functions, Vercel Functions, AWS Lambda
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { generateLicenseKey, validateLicenseKey } = require('./generate-license');
const nodemailer = require('nodemailer');

/**
 * Configure le transporteur d'email
 * Utilise les variables d'environnement pour la sécurité
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour port 465, false pour les autres
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Envoie l'email avec la clé de licence
 * @param {Object} params - Paramètres de l'email
 */
async function sendLicenseEmail(params) {
  const { email, licenseKey, customerName, licenseType, amount } = params;

  const mailOptions = {
    from: `"AutoCalc OptiDevis" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '🎉 Votre licence AutoCalc OptiDevis',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .license-box { background: white; border: 3px solid #2563eb; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
    .license-key { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px; font-family: 'Courier New', monospace; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .steps { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .step { margin: 15px 0; padding-left: 30px; position: relative; }
    .step::before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Merci pour votre achat !</h1>
      <p>Bienvenue dans AutoCalc OptiDevis</p>
    </div>

    <div class="content">
      <p>Bonjour ${customerName || 'Client'},</p>

      <p>Merci d'avoir choisi <strong>AutoCalc OptiDevis</strong> ! Nous sommes ravis de vous compter parmi nos utilisateurs.</p>

      <div class="license-box">
        <h2 style="margin-top: 0; color: #2563eb;">Votre clé de licence</h2>
        <div class="license-key">${licenseKey}</div>
        <p style="color: #666; margin-bottom: 0; font-size: 14px;">Type : ${licenseType} | Montant : ${amount}€</p>
      </div>

      <div class="steps">
        <h3 style="color: #2563eb; margin-top: 0;">📋 Comment activer votre licence :</h3>
        <div class="step">Téléchargez AutoCalc OptiDevis depuis notre site</div>
        <div class="step">Installez le logiciel sur votre ordinateur</div>
        <div class="step">Ouvrez le logiciel et allez dans <strong>Paramètres > Licence</strong></div>
        <div class="step">Copiez-collez votre clé de licence ci-dessus</div>
        <div class="step">Cliquez sur "Activer" et c'est terminé !</div>
      </div>

      <div style="text-align: center;">
        <a href="https://riisalthkraa.github.io/AutoCalc.github.io-autocalc-optidevis/" class="button">
          📥 Télécharger le logiciel
        </a>
      </div>

      <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <strong>⚠️ Important :</strong> Conservez précieusement cet email. Votre clé de licence est valide à vie et vous permet de réinstaller le logiciel sur le même ordinateur autant de fois que nécessaire.
      </div>

      <p><strong>Besoin d'aide ?</strong></p>
      <ul>
        <li>📧 Email : <a href="mailto:Riisalth@hotmail.fr">Riisalth@hotmail.fr</a></li>
        <li>📚 Documentation : <a href="https://riisalthkraa.github.io/AutoCalc.github.io-autocalc-optidevis/documentation.html">Guides et tutoriels</a></li>
      </ul>

      <p>Merci encore pour votre confiance !</p>
      <p><strong>L'équipe AutoCalc OptiDevis</strong></p>
    </div>

    <div class="footer">
      <p>© 2025 AutoCalc OptiDevis - Développé par David VIEY</p>
      <p>Cet email a été envoyé automatiquement suite à votre achat.</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Merci pour votre achat AutoCalc OptiDevis !

Votre clé de licence : ${licenseKey}
Type : ${licenseType} | Montant : ${amount}€

Comment activer votre licence :
1. Téléchargez AutoCalc OptiDevis
2. Installez le logiciel
3. Allez dans Paramètres > Licence
4. Entrez votre clé : ${licenseKey}
5. Cliquez sur Activer

Support : Riisalth@hotmail.fr
Site web : https://riisalthkraa.github.io/AutoCalc.github.io-autocalc-optidevis/

Conservez précieusement cet email !

L'équipe AutoCalc OptiDevis
    `
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Email envoyé à:', email);
}

/**
 * Sauvegarde la vente dans un fichier JSON (optionnel)
 * Utile pour garder un historique des ventes
 */
async function saveSale(saleData) {
  // Pour Netlify/Vercel, tu peux utiliser une base de données externe
  // comme Supabase, MongoDB Atlas, ou Airtable
  // Pour l'instant, on log juste
  console.log('💾 Vente enregistrée:', JSON.stringify(saleData, null, 2));

  // TODO: Intégrer avec une vraie base de données si nécessaire
  // Exemple avec Airtable ou Google Sheets API
}

/**
 * Handler principal du webhook
 * Compatible avec Netlify Functions
 */
exports.handler = async (event, context) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Vérifier la signature du webhook Stripe
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error('❌ Erreur signature webhook:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` })
    };
  }

  // Gérer l'événement checkout.session.completed
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    try {
      console.log('🎉 Paiement réussi pour:', session.customer_email);

      // Générer une nouvelle clé de licence
      const licenseKey = generateLicenseKey();

      // Valider la clé générée
      const isValid = validateLicenseKey(licenseKey);
      if (!isValid) {
        throw new Error('Clé générée invalide !');
      }

      console.log('🔑 Clé générée:', licenseKey);

      // Déterminer le type de licence
      let licenseType = 'Standard';
      const amount = session.amount_total / 100; // Convertir centimes en euros

      if (amount >= 200) {
        licenseType = 'Pro (5 postes)';
      }

      // Envoyer l'email avec la clé
      await sendLicenseEmail({
        email: session.customer_email,
        licenseKey: licenseKey,
        customerName: session.customer_details?.name || '',
        licenseType: licenseType,
        amount: amount
      });

      // Sauvegarder la vente
      await saveSale({
        date: new Date().toISOString(),
        email: session.customer_email,
        name: session.customer_details?.name || '',
        licenseKey: licenseKey,
        licenseType: licenseType,
        amount: amount,
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent
      });

      console.log('✅ Traitement complet pour:', session.customer_email);

      return {
        statusCode: 200,
        body: JSON.stringify({
          received: true,
          licenseGenerated: true,
          emailSent: true
        })
      };

    } catch (error) {
      console.error('❌ Erreur lors du traitement:', error);

      // En cas d'erreur, notifier l'admin
      // TODO: Envoyer un email d'alerte à l'admin

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal server error',
          message: error.message
        })
      };
    }
  }

  // Autres types d'événements (optionnel)
  console.log('ℹ️ Événement reçu:', stripeEvent.type);

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};

/**
 * Pour Vercel, exporter comme ceci :
 */
// module.exports = async (req, res) => {
//   const result = await exports.handler({
//     httpMethod: req.method,
//     headers: req.headers,
//     body: JSON.stringify(req.body)
//   });
//   res.status(result.statusCode).json(JSON.parse(result.body));
// };
