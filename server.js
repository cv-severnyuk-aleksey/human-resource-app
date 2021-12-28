const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const md5 = require("md5");
const db = require("./database.js");
const cors = require("cors");

const app = express();

const accessTokenSecret = 'youraccesstokensecret';
const HTTP_PORT = 3001; 

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    jwt.verify(authHeader, accessTokenSecret, (err, user) => {
      if (err) {
        res.status(400).json({"success":false});
      }

      req.user = user;
      next();
    });
  } else {
    res.json({"success":false});
  }
};

app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

app.get("/api/users", authenticateJWT, (req, res, next) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
});

app.get("/api/qa", authenticateJWT, (req, res, next) => {
    var sql = "select questions.questionId, questions.questionText, questions.correctAnswerId, answers.answerId, answers.answerText from questions left join answers on answers.questionId = questions.questionId"
    var params = []
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"success":false, "error":err.message});
        return;
      }

      let questions = {};
      rows.forEach(row => {
        if (!Object.keys(questions).includes('q' + row.questionId)) {
          questions['q' + row.questionId] = {
            'questionText': row.questionText,
            'correctAnswerId': row.correctAnswerId,
            'answers': [{
              'answerId': row.answerId,
              'answerText': row.answerText,
            }],
          };
        } else {
          questions['q' + row.questionId]['answers'].push({
            'answerId': row.answerId,
            'answerText': row.answerText,
          });
        }
      });

      res.json({
        "success":true,
        "data":questions
      })
    });

});

app.get("/api/user/:id", authenticateJWT, (req, res, next) => {
    var sql = "select * from user where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.password){
      errors.push("No password specified");
    }
    if (!req.body.email){
      errors.push("No email specified");
    }
    if (errors.length){
      res.json({"success": false, "error":errors.join(",")});
      return;
    }
    var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
    var params =[data.name, data.email, data.password]
    db.run(sql, params, function (err, result) {
      if (err){
        res.json({"success": false, "error": err.message})
        return;
      }
      res.json({
        "success": true,
        "id" : this.lastID
      })
    });
});

app.post("/api/results", authenticateJWT, (req, res, next) => {
    var sql = "select * from results where user = ?"
    var params = [req.body.user]
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"success": false, "error":err.message});
        return;
      }
      res.json({
          "success": true,
          "data":rows
      })
    });
});

app.post("/api/result", authenticateJWT, (req, res, next) => {
    var data = {
      user: req.body.user,
      procent: req.body.procent,
      badResult : JSON.stringify(req.body.badResult),
      date: req.body.date
    }
    var sql ='INSERT INTO results (user, procent, badResult, date) VALUES (?,?,?,?)'
    var params =[data.user, data.procent, data.badResult, data.date]
    db.run(sql, params, function (err, result) {
      if (err){
        res.json({"success": false, "error": err.message})
        return;
      }
      res.json({ "success": true })
    });
});

app.get("/api/result/:id", authenticateJWT, (req, res, next) => {
    var sql = "select * from results where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":row
      })
    });
});

app.post('/api/login', (req, res) => {
  var sql = "select * from user where email = ? AND password = ?"
  var params = [req.body.email, md5(req.body.password)]

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }

    if (row) {
      const accessToken = jwt.sign({ id: row.id, email: row.email, password: row.password }, accessTokenSecret, {expiresIn: '1d'});

      res.json({
        accessToken
      });
    } else {
      res.json({"error":'Username or password incorrect'});
    }
  });
});

app.get("/api/echo", authenticateJWT, (req, res, next) => {
  res.json({"success":true, 'user': req.user.id})
});

app.use(function(req, res){
  res.status(404);
});