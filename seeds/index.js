const mongoose = require('mongoose');
const Campground = require("../models/campground");
const Reviews = require("../models/reviews");
const Users = require("../models/user");
const cities = require("./cities");
const cities2 = require("./cities2");
const seedsHelper = require("./seedsHelper");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //For making partials and layout of ejs code
// const ExpressError = require("./utilities/ExpressError");
// const mongoose = require('mongoose');
// const campgroundRoute = require("./routers/campgrounds");
// const reviewRoute = require("./routers/reviews");
// const usersRoute = require("./routers/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); //authentication and authorization
const localStrategy = require("passport-local");
// const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const { MongoStore } = require('connect-mongo');
const MongoDBStore = require('connect-mongo')(session);
// const dbUrl = 'mongodb://localhost:27017/yelpCamp';
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCamp';
// 'mongodb://localhost:27017/yelpCamp'
// "mongodb+srv://PranavKumar:EEoX6Sma6ECaVGfQ@cluster0.90zcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((d) => {
        console.log("Mongoose Connected");
    })
    .catch((err) => {
        console.log("ERROR OCCURED");
        console.log(err);
    })


const secret = process.env.SECRET || "Causeiamslimshady";
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log("Session store Error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

// app.use(helmet({ contentSecurityPolicy: false }));
// app.use(mongoSanitize());
// app.use(session(sessionConfig));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// })
// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use('/campgrounds', campgroundRoute);
// app.use('/campgrounds/:id/reviews', reviewRoute);
// app.use('/', usersRoute);
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.render("home");
// })

// app.all('*', (req, res, next) => {
//     next(new ExpressError("Page Not Found", 404));
// })

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Oh! Nelly!! Something went wrong";
//     res.status(statusCode).render("error", { err });
// })

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//         console.log("Listening on Port 3000");
//     })
//     // mongoose.connect('mongodb://localhost:27017/yelpCamp', { useNewUrlParser: true, useUnifiedTopology: true })
//     //     .then((d) => {
//     //         console.log("Mongoose Connected");
//     //     })
//     //     .catch((err) => {
//     //         console.log("ERROR OCCURED");
//     //         console.log(err);
//     //     })

const seedDB = async() => {
    await Campground.deleteMany({});
    //await Reviews.deleteMany({});
    // await Users.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 400);
        const randPrice = random1000 + 100;
        const random17 = Math.floor(Math.random() * 17);
        const random20 = Math.floor(Math.random() * 20);
        const camp = new Campground({
            author: '611d6200aaaafe0016acc6af',
            location: `${cities2[i].city}, ${cities2[i].admin_name}`,
            title: `${seedsHelper.descriptors[random17]} ${seedsHelper.places[random20]}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel provident consectetur unde, veritatis illum maiores ad in aspernatur non natus impedit optio nobis laborum expedita excepturi doloribus autem. Doloremque, rerum.",
            price: randPrice,
            geometry: {
                type: 'Point',
                coordinates: [
                    parseInt(cities2[i].lng),
                    parseInt(cities2[i].lat)
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876161/YelpCamp/uqrd4xec0bjcpclbgv0u.jpg',
                    filename: 'YelpCamp/uqrd4xec0bjcpclbgv0u'
                },
                {
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876164/YelpCamp/oqyzbzepr9rivuihf0zj.jpg',
                    filename: 'YelpCamp/oqyzbzepr9rivuihf0zj'
                },
                {
                    url: 'https://res.cloudinary.com/dffutljrz/image/upload/v1628876186/YelpCamp/fwyiklxyuwwzpcstwa88.jpg',
                    filename: 'YelpCamp/fwyiklxyuwwzpcstwa88'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})