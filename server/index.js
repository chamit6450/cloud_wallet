const express = require('express');
const {Keypair} = require('@solana/web3.js');
const { userModel } = require("./models.js");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const app = express()
app.use(express.json())
app.use(cors())
const JWT_SECRET = "123456"
PORT = 3000


app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const keypair = new Keypair();
    await userModel.create({
        username,
        password,
        publicKey: keypair.publicKey.toString(),
        privateKey: keypair.secretKey.toString()
    })
    res.json({
        message: keypair.privateKey.toString()

    })
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.findOne({
        username: username,
        password: password
    })

    if (user) {
        const token = jwt.sign({
            id: user
        }, JWT_SECRET)
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Credentials are incorrect"
        })
    }
})



app.listen(PORT,()=>
 console.log(`this app is running on http://localhost:${PORT}`)
);