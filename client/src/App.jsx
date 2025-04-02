import { useState } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import "./App.css";
import axios from "axios";

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/ZWwUXCzMoNJqmu20g8F9rE6yD90laxIx")
const senderPubKey = new PublicKey("Ce4JubsvSZXsdU7YQXYgy1jX3WUEiAHTvvWE7G31qkrj")

function App() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [signed, setSigned] = useState(false);
  const [userpubKey, setPubKey] = useState("");

  async function postData(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3000/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    // alert(JSON.stringify(data));

    setPubKey(data.publicKey);

    console.log("Signup Response:", data);


    if (response.ok) {
      setSigned(true);
    }
  }

  // async function getData(event) {
  //   event.preventDefault();
  //   if (!signed) return;

  //   const response = await fetch(
  //     `http://localhost:3000/api/v1/signin?username=${username}&password=${password}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );

  //   const data = await response.json();
  //   alert(JSON.stringify(data));
  // };

  async function sendSol(){
    // alert("i m sol")
    console.log("User Public Key:", userpubKey);

    // const senderPubKey = new PublicKey(userpubKey);
    console.log("User Public Key:", userpubKey);
    console.log("senderPubKey:", senderPubKey);


    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPubKey,
        toPubkey: "3hTk6yxkMR4QLbBaFDykKiXkD8zY5rbLNhGPhzJtG1Wv",
        lamports: 0.01 * LAMPORTS_PER_SOL
      })
    )
   
    const {blockhash} =await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = senderPubKey

    const serializedTxn = tx.serialize({
      requireAllSignatures : false,
      verifySignatures : false
    })

    console.log(serializedTxn);
    const encodedTxn = serializedTxn.toString("base64");

    const response = await axios.post("http://localhost:3000/api/v1/txn/sign", {
      serializedtxn: encodedTxn
    });
    alert(response.data.signature);
    console.log("sign successful fe")
 
  };

  return (
    <>
      {/* {!signed ? ( */}
        <form onSubmit={postData}>
          <input
            type="text"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter username"
            value={username}
          />
          <input
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            value={password}
          />
          <button type="submit">Sign Up</button>
        </form>
        <button onClick={sendSol}>Send Sol</button>
      {/* // ) : (
      //   <>
      //     <form onSubmit={getData}>
      //       <input
      //         type="text"
      //         onChange={(event) => setUsername(event.target.value)}
      //         placeholder="Enter username"
      //         value={username}
      //       />
      //       <input
      //         type="password"
      //         onChange={(event) => setPassword(event.target.value)}
      //         placeholder="Enter password"
      //         value={password}
      //       />
      //       <button type="submit">Sign In</button>
      //     </form>
      //     <button onClick={() => setSigned(false)}>Log out</button>
      //   </>
      // )} */}
    </>
  );
}

export default App;
