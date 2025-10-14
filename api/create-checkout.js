/**
 * Fonction pour créer une session Stripe Checkout
 * Compatible avec Netlify Functions, Vercel Functions
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Handler pour créer une session de paiement
 */
exports.handler = async (event, context) => {
  // Autoriser uniquement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { priceId, licenseType } = body;

    // Validation
    if (!priceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'priceId est requis' })
      };
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.URL || 'https://riisalthkraa.github.io/AutoCalc.github.io-autocalc-optidevis'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://riisalthkraa.github.io/AutoCalc.github.io-autocalc-optidevis'}/tarifs.html`,
      customer_email: body.email || undefined,
      metadata: {
        licenseType: licenseType || 'Standard'
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('❌ Erreur création session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Erreur lors de la création de la session',
        message: error.message
      })
    };
  }
};
