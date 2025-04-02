const express = require('express');
const {Keypair, Transaction, Connection} = require('@solana/web3.js');
const { userModel } = require("./models.js");
const cors = require('cors');
const jwt = require("jsonwebtoken");
// const { connection } = require('mongoose');
const app = express()
app.use(express.json())
app.use(cors())
const JWT_SECRET = "123456"
PORT = 3000
const bs58 = require("bs58");

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/ZWwUXCzMoNJqmu20g8F9rE6yD90laxIx")


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
        message: keypair.publicKey.toString()
    })
})

// app.post("/api/v1/signin", async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;

//     const user = await userModel.findOne({
//         username: username,
//         password: password
//     })

//     if (user) {
//         const token = jwt.sign({
//             id: user
//         }, JWT_SECRET)
//         res.json({
//             token
//         })
//     } else {
//         res.status(403).json({
//             message: "Credentials are incorrect"
//         })
//     }
// })

app.post("/api/v1/txn/sign", async (req, res) => {
 
    
    const serializedtxn = req.body.serializedtxn;
    if (!serializedtxn) {
        return res.status(400).json({ error: "Missing transaction data" });
    }
    console.log("check 1")

const tx = Transaction.from(Buffer.from(serializedtxn, "base64")); // Decode base64


  console.log(tx);
  console.log("check 2")
  const keyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));
  console.log("check 3")

  const {blockhash} = await connection.getLatestBlockhash();
  tx.blockhash = blockhash
  tx.feePayer = keyPair.publicKey
  console.log("check 4")
  tx.sign(keyPair);

  const signature = await connection.sendTransaction(tx, [keyPair]);
  console.log("this ie me" ,signature)
  

  res.json({
    message: "Transaction submitted successfully",
    signature: signature,
});
})

app.listen(PORT,()=>
 console.log(`this app is running on http://localhost:${PORT}`)
);