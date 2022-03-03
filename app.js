//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
const flash = require('connect-flash');
const userRoutes = require('./routes/userRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const {initCollection} = require('./models/connection');
//create app
const app = express()

//configure app
let port = 4000;
let host = 'localhost';
let url = 'mongodb://localhost:27017';
app.set('view engine', 'ejs');

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(session({
    secret: 'jl2k4j51hjkah4',
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/project2'}),
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000}
}));

app.use(flash());

app.use((req, res, next)=>{
    console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.name = req.session.name || 'Guest';
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

app.use(methodOverride('_method'));

mongoose.connect('mongodb://localhost:27017/project2',
    {})
.then(() =>{
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
}).catch(err=> console.log(err.message));


app.use('/connection', connectionRoutes);
app.use('/users', userRoutes);


//set up routes
app.get('/', (req, res, next)=>{
    let id = req.session.user;
    User.findById(req.session.user)
    .then(user=>{
        res.render('index', {user});   
    })
    .catch(err=>next(err));    
});


app.get('/about', (req, res)=> {
    let id = req.session.user;
    User.findById(req.session.user)
    .then(user=>{
        res.render('./general/about', {user});  
    })
    .catch(err=>next(err));  
    
});


app.get('/contact', (req, res)=> {
    let id = req.session.user;
    User.findById(req.session.user)
    .then(user=>{
        res.render('./general/contact', {user});  
    })
    .catch(err=>next(err));  
    
});

//get sign up form
app.get('/new', (req, res)=>{
    res.render('new');
})

app.use((req, res, next)=>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err})
});
