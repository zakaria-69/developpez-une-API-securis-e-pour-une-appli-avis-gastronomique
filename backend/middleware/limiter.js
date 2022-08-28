const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 10, // Limit each IP to 10 requests per `window` (here, per 3 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
module.exports = (limiter); 