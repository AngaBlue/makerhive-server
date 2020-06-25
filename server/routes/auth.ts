import passport from "passport";
import { Router } from "express";

const router = Router();
//Redirect to Google OAuth Provider
router.get("/google/", passport.authenticate("google", { scope: ["profile", "email"] }));

//Google OAuth Provider Callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
        failureFlash: true
    }),
    function (req, res) {
        if (!req.user) return res.redirect("/auth/google");
        return res.redirect("/");
    }
);

export default router;
