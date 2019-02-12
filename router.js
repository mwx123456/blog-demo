var express = require("express")
var User = require("./models/user")
var md5 = require("blueimp-md5")
var router = express.Router()

router.get("/",function(req,res){
    // console.log(req.session.user)
    res.render("index.html",{
        user:req.session.user
    })
})

router.get("/login",function(req,res){
    res.render("login.html")
})

router.post("/login",function(req,res){
    //1.获取表单数据2.判断查询数据库中用户名和密码是否正确3.发送响应
    var body = req.body
    User.findOne({
        email:body.email,
        password:md5(md5(body.password))
    },function (err,user) {
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message
            })
        }

        if(!user){
            return res.status(500).json({
                err_code:1,
                message:"用户名和密码无效"
            })
        }

        //登录成功之后要记录session登录状态
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:"ok"
        })
      })
})

router.get("/register",function(req,res){
    res.render("register.html")
})

router.post("/register",async function (req,res) {
    // console.log(req.body)
    // 业务逻辑：1.获取表单提交的数据2.操作数据库 判断该用户是否存在 存在不能注册3.发送相应
    var body = req.body

    // try{
    //     if (await User.findOne({ email: body.email })){
    //         return res.status(200).json({
    //             err_code:1,//设置状态码
    //             message:"邮箱已经存在"  
    //         })          
    //     }
    //     if (await User.findOne({ nickname: body.nickname })){
    //         return res.status(200).json({
    //             err_code:2,//设置状态码
    //             message:"昵称已经存在"   
    //         })        
    //     }
    //     body.password = md5(md5(body.password))
    //     await new User(body).save()
    //     //注册成功使用session记录用户的登陆状态
      
    //     res.status(200).json({
    //         err_code:0,
    //         message:"ok"
    //     })   
    // }catch(error) {
    //     return res.status(500).json({
    //         success:false,
    //         message:"服务端错误"
    //     })
    // }
    User.findOne({
       $or:[{
            email:body.email
       },{
           nickname:body.nickname
       }]
    },function (err,data) {
        if(err){
            return res.status(500).json({
                success:false,
                message:"服务端错误"
            })
        }
        // console.log(data)
        if(data){
            return res.status(200).json({
                err_code:1,//设置状态码
                message:"邮箱或者昵称已经存在"
            })
        }
        //对密码进行md5加密
        body.password = md5(md5(body.password))
    
        //开发一条记录
        new User(body).save(function (err,user) {
            if(err){
                return res.status(500).json({
                     err_code:500,
                    message:"服务端错误"
                })
            }
            req.session.user = user
              //express提拱了一个相应方法json() 可以接受一个对象作为参数 会自动吧你给定的对象转换为字符串发送给浏览器
            res.status(200).json({
                err_code:0,
                message:"ok"
            })
          })

      
      })

  })

router.get("/loginout",function (req,res) {
    //清除登录状态
    req.session.user = null
    // 重定向到登录网页
    res.redirect("./login")

  })
module.exports = router