import { config, db } from "../index"
import { app } from "../server";
import passport from "passport";
import session from "express-session";
import cors from "cors";
var MySQLStore = require('express-mysql-session')(session);
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";

let store = new MySQLStore({ expiration: config["cookie.expiry"] }, db)

app.set('trust proxy', 1)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true
}))
app.use(session({
    secret: config["cookie.secret"],
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        domain: "makerhive.anga.blue",
        secure: true,
        maxAge: 31536000000, // 1 year
        sameSite: "none"
    }
}))

app.use((req, res, next) => {
    console.log(req.user)
    next()
})

app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser(async function (user: any, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (userID, cb) {
    let user = (await db.query("SELECT * FROM users WHERE id = ?", [userID]))[0][0]
    cb(null, user);
});

passport.use(new GoogleStrategy({
    clientID: config["auth.google.clientid"],
    clientSecret: config["auth.google.secret"],
    callbackURL: "https://makerhive.anga.blue/auth/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile: GoogleProfile, done) {
        let userID = (await db.query("SELECT id FROM users WHERE email = ?", [profile._json.email]))[0][0]
        if (!userID) {
            if (profile._json.hd !== "cgs.vic.edu.au") throw new Error(`Invalid email ${[profile.emails[0].value]}`)
            //@ts-ignore insertId is valid.
            userID = (await db.execute(`INSERT INTO users (name, email) VALUES (?, ?)`, [profile._json.name, profile._json.email]))[0].insertId
        } else {
            userID = userID.id
        }
        let user = (await db.query("SELECT * FROM users WHERE `users`.`id` = ?", [userID]))[0][0]
        return done(null, user);
    }
));