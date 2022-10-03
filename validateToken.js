require("dotenv").config()

const express = require("express")
const app = express()
app.use(express.json())

const jwt = require("jsonwebtoken")

const port = process.env.PORT

app.listen(port, () => {
  console.log('Validation server running on ${port}...')
})

app.get("/posts", validateToken, (req, res) => {
  console.log("Valid token")
  console.log(req.body.user)
  res.send('${req.user.user} successfully accessed port')
})

function validateToken(req, res, next){
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  if(token == null)
    res.sendStatus(400).send("Token not present")
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      res.status(403).send("Invalid token")
    }
    else{
      req.user = user
      next()
    }
  })
}