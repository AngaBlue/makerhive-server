import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.disable("x-powered-by");

//Auth
import "./middleware/auth"

//Serve React Build
app.use(express.static(path.join(__dirname, '../client/build')));

//Create Auth Route
import authRoute from "./routes/auth"
app.use('/auth', authRoute)

//Create API Route
import apiRoute from "./routes/api"
app.use('/api', apiRoute)

//Serve React Build
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.use(function (err, req, res, next) {
    if (err)
        console.error(err)
    next()
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Makerhive Server Started on Port ${process.env.PORT || 3000}`)
});

export { app }