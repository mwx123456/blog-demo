var express = require("express")
var path = require("path")
var bodyParser = require("body-parser")
var session = require("express-session")

var router = require("./router")
var app = express()

//配置body-parser
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())
//配置session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.use("/public",express.static(path.join(__dirname,"./public/")))
app.use("/node_modules",express.static(path.join(__dirname,"./node_modules/")))

app.engine("html",require("express-art-template"))

app.set("views",path.join(__dirname,"./views/"))

// app.get("/",function(req,res){
//     res.render("index.html")
// })
app.use(router)
app.listen("3000",function () {
    console.log("it is running.......")
  })