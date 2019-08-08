const express = require("express");
const app = express();
const morgan = require ('morgan');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const userRoute = require('./api/routes/userRoutes');
const groupRoute = require('./api/routes/groupRoutes');
const expenseRoute = require('./api/routes/expenseRoutes');
mongoose.set('useFindAndModify', false);
//const checkAutho=require('../middelware/check-auth');


mongoose.connect('mongodb+srv://amit_shinde:' +
    process.env.MONGO_PW +
    '@node-rest-shop-3odr0.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true
    });
    app.use(morgan('dev'));


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
//app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});


app.use('/uploads',express.static('uploads'));

app.use('/users',userRoute)
app.use('/groups',groupRoute)
app.use('/expense',expenseRoute)




//router.get('/uploads/:id',(req,res,next)=>{
//    const filepath = req.params.id;
//    //filepath=req.body.path;
//     res.sendFile('uploads/1.jpg-1562414264691.jpeg');
//})
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.err || 500);
    res.json({ error: { message: error.message } });

});





module.exports = app;