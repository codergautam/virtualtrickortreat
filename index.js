const express = require('express')
const app = express()
const port = process.env.PORT|| 3000
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.static(__dirname+"/client"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')
const api = require("./api/api")

app.get('/logout', (req, res) => {
  res.cookie('session', 'false')
  res.redirect("/")
})
app.get('/', (req, res) => {
if(req.cookies.session == "true") {
  api.checkdata(req.cookies.authorization, req.cookies.uname)
  .then((acc) => {
    if(!acc) {
      res.cookie('session', 'false')
    }
    res.render('index', {session: acc, uname: req.cookies.uname})
  })
 
} else {
  res.render('index', {session: false})
}

})
app.get('/create', (req, res) => {
  if(req.cookies.session == "true") {
    api.checkdata(req.cookies.authorization, req.cookies.uname)
    .then((acc) => {
      if(!acc) {
        res.render('create')
      } else {
        res.redirect('/')
      }

    })
   
  } else {
    res.render('create')
  }
  })
  app.get('/login', (req, res) => {
    if(req.cookies.session == "true") {
      api.checkdata(req.cookies.authorization, req.cookies.uname)
      .then((acc) => {
        if(!acc) {
          res.render('login')
        } else {
          res.redirect('/')
        }

      })
     
    } else {
      res.render('login')
    }
  })
  app.get('/play', (req, res) => {
    if(req.cookies.session == "true") {
      api.checkdata(req.cookies.authorization, req.cookies.uname)
      .then((acc) => {
        if(!acc) {
          res.redirect('/')
        } else {
          res.render('play', {uname: req.cookies.uname, authorization: req.cookies.authorization})
        }

      })
     
    } else {
      res.redirect('/')
    }
  })
  app.get('/inventory', (req, res) => {
    if(req.cookies.session == "true") {
      api.checkdata(req.cookies.authorization, req.cookies.uname)
      .then((acc) => {
        if(!acc) {
          res.redirect('/')
        } else {
          api.getuser(req.cookies.uname)
          .then((data) => {
            if(data.success) {
              res.render('inv', {uname: req.cookies.uname, inv: data.user.inv, candy: api.candy, bal: data.user.bal})
            } else {
              res.redirect('/')
            }
          })
          
        }

      })
     
    } else {
      res.redirect('/')
    }
  })
  app.get('/sell', (req, res) => {
    if(req.cookies.session == "true") {
      api.checkdata(req.cookies.authorization, req.cookies.uname)
      .then((acc) => {
        if(!acc) {
          res.redirect('/')
        } else {
          api.getuser(req.cookies.uname)
          .then((data) => {
            if(data.success) {
              res.render('sell', {uname: req.cookies.uname, inv: data.user.inv, candy: api.candy, authorization: req.cookies.authorization})
            } else {
              res.redirect('/')
            }
          })
          
        }

      })
     
    } else {
      res.redirect('/')
    }
  })
app.get('/api', (req, res) => {
    res.redirect('/')
})

app.post('/api/newacc',  (req, res) => {
    api.newacc(req.body.uname, req.body.pword)
    .then((data) => {
        res.end(JSON.stringify(data))
    })
    .catch((err) => {
        res.end({success: false, errormsg: err.toString()})
    })
 
})
app.post('/api/login',  (req, res) => {
  api.login(req.body.uname, req.body.pword)
  .then((data) => {
      res.end(JSON.stringify(data))
  })
  .catch((err) => {
      res.end({success: false, errormsg: err.toString()})
  })

})
app.post('/api/earn',  (req, res) => {
  api.earn(req.body.uname, req.body.authorization)
  .then((data) => {
      res.end(JSON.stringify(data))
  })
  .catch((err) => {
      res.end({success: false, errormsg: err.toString()})
  })

})
app.post('/api/sell',  (req, res) => {
  api.sell(req.body.uname, req.body.authorization, req.body.candy, req.body.amount)
  .then((data) => {
      res.end(JSON.stringify(data))
  })
  .catch((err) => {
      res.end({success: false, errormsg: err.toString()})
  })

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})