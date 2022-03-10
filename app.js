const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
dotenv.config({ path: './config/config.env'})
require('./config/Passport')(passport)
const Port = process.env.PORT || 5000
const db = require('./config/db')
const User = require('./model/User')

const app = express()


db();
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.send('Welcome to Express')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.get('/dashboard', (req,res)=>{
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
       }
       res.redirect('/login')
    })
})


app.post('/userlogin',  (req,res)=>{
    User.findOne({ email: req.body.email }, (err,result)=>{
        if(err) throw err
        if(result == null){
            console.log('User not found')
        }
        if(result != null){
            const dbPass = result.password
            if(dbPass == req.body.password){
                res.redirect('/dashboard')
                
            }
        }
    })
})




/*
User.findOne({ email: req.body.email}, (err,result)=>{
       if(err){
           console.error(err)
       }
       if(result == null){
           console.log('User Not Found')
       }
       if(result != null){
           
       }
   })
   */





app.listen(Port, (req,res)=>{
    console.log(`Application running on Port: ${Port}`)
})