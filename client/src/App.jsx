import { useState } from 'react';
import './App.css'

function App() {
  const [username, setUsername] = useState();
  const [password,setPassword] = useState();

  async function postData(event){
    event.preventDefault();
     const response = await fetch('http://localhost:3000/api/v1/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();
    alert(JSON.stringify(data)  );
    console.log(data);

  }

  return (
    <>
    <form onSubmit={postData}>
      <input onChange={((event)=>setUsername(event.target.value))} placeholder='Enter username'/>
      <input onChange={((event)=>setPassword(event.target.value))} placeholder='Enter password'/>
      <button type='submit'>Submit</button>
    </form>
    </>
  )
}

export default App
