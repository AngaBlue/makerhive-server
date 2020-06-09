import passport from "passport"
import { Router } from "express";
import "../"
let router = Router()

router.get('/google/',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google' }),
    function (req, res) {
        if (!req.user) return res.redirect("/auth/google")
        console.log(req.user)
        return res.redirect('/');
    });

export default router;