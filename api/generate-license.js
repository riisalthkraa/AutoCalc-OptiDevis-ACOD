/**
 * Générateur de clés de licence pour AutoCalc OptiDevis
 * Compatible avec le système de validation du logiciel
 */

const crypto = require('crypto');

/**
 * Génère une clé de licence au format AC-XXXX-XXXX-XXXX-XXXX
 * Identique à la fonction dans main.js de l'application
 */
function generateLicenseKey() {
  const prefix = 'AC'; // AutoCalc
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();

  // Calculer le checksum pour validation
  const checksum = crypto.createHash('sha256')
    .update(part1 + part2 + part3)
    .digest('hex')
    .substring(0, 4)
    .toUpperCase();

  return `${prefix}-${part1}-${part2}-${part3}-${checksum}`;
}

/**
 * Valide une clé de licence
 * @param {string} key - La clé à valider
 * @returns {boolean} - True si valide
 */
function validateLicenseKey(key) {
  if (!key || typeof key !== 'string') return false;

  const parts = key.split('-');
  if (parts.length !== 5) return false;
  if (parts[0] !== 'AC') return false;

  const [prefix, part1, part2, part3, providedChecksum] = parts;

  // Recalculer le checksum
  const expectedChecksum = crypto.createHash('sha256')
    .update(part1 + part2 + part3)
    .digest('hex')
    .substring(0, 4)
    .toUpperCase();

  return providedChecksum === expectedChecksum;
}

module.exports = {
  generateLicenseKey,
  validateLicenseKey
};
