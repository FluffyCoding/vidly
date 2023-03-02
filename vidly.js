const express = require("express");
const IP = require('ip');
const dotenv = require('dotenv');
dotenv.config();
const {connectMongo} = require("./config/dbConnection");
const {customerRouter} = require("./routers/customers_router");
const {moviesRouter} = require("./routers/movies_router");
const {genresRouter} = require("./routers/geners_router");
const {rentalRouter} = require("./routers/rental_router");
const {userRouter} = require("./routers/user_router");
const {authRouter} = require("./routers/auth_router");


connectMongo();

const ipAddress = IP.address();
console.log(`Machine Ip Address is : ${ipAddress}`);

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/customer', customerRouter);
app.use('/movies', moviesRouter);
app.use('/genres', genresRouter);
app.use('/rentals', rentalRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running!\nAPI documentation: http://localhost:${process.env.SERVER_PORT}/api-docs`)
});


