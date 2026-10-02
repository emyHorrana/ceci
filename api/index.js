// Entry point da serverless function na Vercel.
// api/package.json define "type": "commonjs", permitindo o uso de require()
// e garantindo que a Vercel detecte este arquivo (.js) como Serverless Function.
module.exports = require('../server/index.js');