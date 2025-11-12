// src/middlewares/sanitizers.js
const sanitizeHtml = require('sanitize-html');

/**
 * sanitizeFields(['nombre','descripcion']) -> middleware
 * limpia solo los campos indicados si existen en req.body
 */
function sanitizeFields(fields = []) {
  return (req, res, next) => {
    if (!req.body) return next();
    fields.forEach((f) => {
      if (typeof req.body[f] === 'string') {
        req.body[f] = sanitizeHtml(req.body[f], {
          allowedTags: [],
          allowedAttributes: {},
        }).trim();
      }
    });
    next();
  };
}

module.exports = { sanitizeFields };