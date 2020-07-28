import { config } from "../index";
import { app } from "../server";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import { image as downloadImage } from "image-downloader";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { TypeormStore } from "typeorm-store";
import { getRepository } from "typeorm";
import { Session } from "../entities/Session";
import { User } from "../entities/User";
import path from "path";
import fs from "fs";
import { Profile } from "../typings/Google";

app.set("trust proxy", 1);
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(
    session({
        secret: config.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({
            repository: getRepository(Session),
            clearExpired: true
        }),
        cookie: {
            domain: "makerhive.anga.blue",
            secure: true,
            sameSite: "none",
            maxAge: parseInt(config.COOKIE_EXPIRY)
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(async function (user: any, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function (userID: number, cb) {
    //Get user w/ rank
    let user = await getRepository(User).findOne({
        where: { id: userID },
        relations: ["rank"]
    });
    cb(null, user || null);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENTID,
            clientSecret: config.GOOGLE_SECRET,
            callbackURL: "https://makerhive.anga.blue/auth/google/callback",
            passReqToCallback: true
        },
        async function (request, accessToken, refreshToken, _profile: GoogleProfile, done) {
            const profile = (_profile as unknown) as Profile;
            const userRepository = getRepository(User);
            //Find User by Email
            let user = await userRepository.findOne({
                email: profile._json.email
            });
            if (!user) {
                //If New User
                if (profile._json.hd !== "cgs.vic.edu.au")
                    return done(
                        `Invalid email ${profile._json.email}.\nPlease sign in with your school email ".cgs.vic.edu.au".`
                    );
                user = userRepository.create({
                    name: profile.displayName,
                    email: profile._json.email
                });
            }
            //Add or Update User
            user = await userRepository.save(user);
            //Update Profile Picture
            try {
                let filename = `${user.id}-${Date.now().toString(32)}`;
                await downloadImage({
                    url: profile._json.picture,
                    dest: path.join(__dirname, "../../static/images/user", `${filename}.jpg`)
                    //timeout: 5000
                });
                if (user.image) {
                    //Delete old image asynchronously (non-blocking)
                    fs.unlink(path.join(__dirname, "../../static/images/user", `${user.image}.jpg`), () => {});
                }
                user.image = filename;
                user = await userRepository.save(user);
            } catch (error) {}
            return done(null, user);
        }
    )
);
