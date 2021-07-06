const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const PORT = 3000;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const mongoose = require('mongoose');

const app = express();

const campgroundsRoute = require('./routes/campgrounds')
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users')

const User = require('./models/user');


const ExpressError = require('./utils/ExpressError');

//set engine
app.engine('ejs', ejsMate);
// set view engine and path of views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// use buitin middleware for use req.body
app.use(express.urlencoded({ extended: true }));
// use method-override
app.use(methodOverride('_method'));
// use static file
app.use(express.static(path.join(__dirname, 'public')));

// connect to mongo
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// handle...
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', () => {
    console.log('Database connected!')
});

const sessionConfig = {
    resave: false,
    saveUninitialized: true,
    secret: "ThisisaSecret",
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7, // 1 Day
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 Day
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// global variable
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRoute);
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'pesol@lol.com', username: 'pesol' });
//     const newUser = await User.register(user, 'monkey') // save โดยอัตโนมัติ
//     res.send(newUser);
// })

// root page
app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

// route for handle error
app.use((err, req, res, next) => {
    const { message = 'SOMETHING WENT WRONG!', status = 500, stack } = err;
    res.status(status).render('error', { message, status, stack });
})

// open server
app.listen(PORT, () => {
    console.log('App listening on PORT: ', PORT)
})