const passwordValidator = require('password-validator');

// Create a schema
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

//verification conditions password
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();

    } else {
        return res
            .status(400)
            .json({ error: `le mot de passe n'est pas assez fort : ` + passwordSchema.validate(`req.body.password`, { list: true }) })
    }
};