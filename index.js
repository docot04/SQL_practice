const { connection } = require("./db");

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const {v4:uuidv4} = require('uuid');
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

// check server status
app.get("/", (req,res) => {
    res.send(`server is running`);
});

// home route
app.get("/home",(req,res) => {
  let q = `SELECT COUNT(*) FROM user`;
  try {
    connection.query(q, (err, result) => {
        if(err) throw err;
        let usercount = result[0]["COUNT(*)"];
        res.render(`home.ejs`,{usercount});
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})

// show all users
app.get("/user",(req,res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
        if(err) throw err;
        res.render(`showusers.ejs`,{users});
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})

// edit route
app.get("/user/:id/edit", (req,res) => {
  let{id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        res.render(`edit.ejs`,{user});
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})

// Update route (in DB)
app.patch("/user/:id",(req,res)=>{
  let{id} = req.params;
  let {password : formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        if(formPass !== user.password){
          res.send("Wrong Password");
        } else {
          let q1 = `SELECT COUNT(*) AS count FROM user WHERE username = '${newUsername}'`;
          connection.query(q1, (err, result) => {
            if(err) throw err;
            if(result[0].count > 0){
              res.send("Username already exists in database");
            } else {
              let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
              connection.query(q2, (err, result) => {
                if(err) throw err;
                res.redirect("/user");
              })
            }
          })
        }
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})

// New user route
app.get("/user/new", (req,res) => {
  res.render("new.ejs")
})

// Create new user
app.post("/user", (req,res) => {
  let {username, email, password} = req.body;
  let id = uuidv4();
  let q = `INSERT IGNORE INTO user (id, username, email, password) VALUES ("${id}", "${username}", "${email}", "${password}")`;
  try {
    connection.query(q, (err, result) => {
        if(err) throw err;
        if(result.affectedRows===0) {
          res.send("Username or Email already exists in Database");
        } else {
          res.redirect("/user");
        }
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})


// delete route
app.get("/user/:id/delete", (req,res) => {
  let{id} = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
        if(err) throw err;
        let user = result[0];
        res.render(`delete.ejs`,{user});
      });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})


// delete user
app.delete("/user/:id", (req,res) => {
  let {id} = req.params;
  let {password: formPass} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(formPass !== user.password) {
        res.send("Wrong Password");
      } else {
        let q1 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q1, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        })
      }
    });
  } catch (err) {
    console.log(err);
    res.send(`SQL error`);
  }
})


// server start
app.listen(port, () =>{
    console.log(`listening to port: ${port}`);
});