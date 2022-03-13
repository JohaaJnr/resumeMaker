const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
dotenv.config({ path: './config/config.env'})
require('./config/Passport')(passport)
const Port = process.env.PORT || 5000
const db = require('./config/db')
const User = require('./model/User')
const session = require('express-session')
const { ensureAuth, ensureGuest } = require('./middleware/auth')
const app = express()


db();
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
  }))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.send('Welcome to Express')
})

app.get('/login', ensureGuest, (req,res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.get('/dashboard', ensureAuth, (req,res)=>{
    res.render('dashboard')
})

app.post('/user_register', (req,res)=>{
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    User.findOne({ email: req.body.email}, (err,result)=>{
        if(err){
            console.error(err)
        }
        if(result == null){
            User.create(newUser)
           console.log('User Created')
        }
       if(result != null){
           console.log('User Already Exists')
           res.redirect('/login')
       }
      
    })
})


app.post('/userlogin',  (req,res)=>{
   const username = req.body.email
   const password = req.body.password

   User.findOne({ email: username }, (err, user)=>{
        if(err) throw err
        if(user == null){
            res.redirect('/login')
            console.log('User Not Found')
        }
        if(user){
            if(user.email == username && user.password == password){
                req.session.username = user.name
                req.session.id = user._id
                console.log(req.session.id)

                res.redirect('/dashboard')
            }else{
                console.log('User & Password Mismatch')
                res.redirect('/login')
            }
        }
   })
})

app.get('/logout', (req,res)=>{
    req.session.destroy()
   console.log(req.session)
    res.redirect('/login')
})



app.listen(Port, (req,res)=>{
    console.log(`Application running on Port: ${Port}`)
})