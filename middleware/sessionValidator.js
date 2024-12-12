const sessions = require('../session'); // Importér session-objekt

module.exports = (req, res, next) => {
    const sessionId = req.cookies.auth_session;

    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).send('Not authenticated.');
    }

    req.user = sessions[sessionId].user; // Gem brugerdata i request-objektet
    next();
};
