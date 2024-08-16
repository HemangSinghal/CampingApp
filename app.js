if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_KEY)

const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews')
const db_url = process.env.MONGO_URL;

mongoose.connect(db_url, {
    useNewUrlParser: true,

    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize())
app.use(helmet({ contentSecurityPolicy: false }))

// const store = new MongoDBStore({
//     url: db_url,
//     secret: 'thisshouldbeabettersecret!',
//     touchAfter: 24 * 3600
// })

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })
const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: db_url,  // Use the DATABASE_URL from your .env file
        // mongooseConnection: db,  // Alternatively, use this if you already have a mongoose connection instance
        ttl: 14 * 24 * 60 * 60 // Session expiration time in seconds (optional)
    }),
    name: 'session',
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}


app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})
app.get('/home', (req, res) => {
    res.render('home');
})
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);

})