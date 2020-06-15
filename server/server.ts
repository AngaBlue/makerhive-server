import express, {} from 'express';
import path from 'path';

const app = express();

//Middleware
import "./middleware/misc"
import "./middleware/auth"

//Serve React Build
app.use(express.static(path.join(__dirname, '../client/build')));

//Serve Other Static Content
app.use(express.static(path.join(__dirname, '../static')));

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

app.listen(process.env.PORT || 3000, () => {
    console.log(`Makerhive Server Started on Port ${process.env.PORT || 3000}`)
});

export { app }