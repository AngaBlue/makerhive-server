import passport from "passport"
import { Router } from "express";

const router = Router()

router.get('/google/',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/',
        failureFlash: true
    }),
    function (req, res) {
        if (!req.user) return res.redirect("/auth/google")
        return res.redirect('/');
    });

export default router;