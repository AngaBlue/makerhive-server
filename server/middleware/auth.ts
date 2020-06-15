import { config, db } from "../index"
import { app } from "../server";
import passport from "passport";
import * as session from "express-session";
import cors from "cors";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { TypeormStore } from "connect-typeorm";
import data from "../data/"
import { Session } from "../entities/Session";

app.set('trust proxy', 1)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    preflightContinue: true
}))
app.use(session.default({
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new TypeormStore({
        cleanupLimit: 2,
        ttl: config.COOKIE_EXPIRY
    }).connect(db.getRepository(Session)),
    cookie: {
        domain: "makerhive.anga.blue",
        secure: true,
        maxAge: config.COOKIE_EXPIRY,
        sameSite: "none"
    }
}))

app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser(async function (user: any, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (userID: number, cb) {
    let user = await data.users.fetch(userID)
    cb(null, {
        ...user,
        rank: data.cache.ranks.find(r => r.id === user.rank)
    });
});

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENTID,
    clientSecret: config.GOOGLE_SECRET,
    callbackURL: "https://makerhive.anga.blue/auth/google/callback",
    passReqToCallback: true,
},
    async function (request, accessToken, refreshToken, profile: GoogleProfile, done) {
        let user = await data.users.fetchByEmail(profile._json.email)
        if (!user) {
            //If New User
            if (profile._json.hd !== "cgs.vic.edu.au") return done(`Invalid email ${profile._json.email}`)
        }
        //Add or Update User
        await data.users.add({
            name: profile._json.name,
            email: profile._json.email,
            image: profile._json.picture
        })
        user = await data.users.fetchByEmail(profile._json.email)
        return done(null, user);
    }
));