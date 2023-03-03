const express = require('express');
const sessions = require('express-session')
const app = express();
const threeMonths = 1000 * 60 * 60 * 24 * 3


let uSession;

const userSession = (req, res, next) => {

    uSession = req.session
    uSession.email = req.body.email
    console.log(uSession);

    uSession.save(function (err) {
        if (err) return next(err)
    })
    next();
}

module.exports = userSession;
