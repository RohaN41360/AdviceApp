import axios from "axios";
import { useState } from "react";

import './App.css';

function App() {
  const [data,setData] = useState("In order to get, you have to give.")

  const getadvice = () =>{
    axios.get("	https://api.adviceslip.com/advice")
    .then((result)=>{
      setData(result.data.slip.advice)
      
    })
    .catch((error)=>{
      console.log(error)
    })
  }


  return (
        <div className="App">
                <div class="bg"></div>
                <div class="bg bg2"></div>
                <div class="bg bg3"></div>
                <div class="content">
                    <h1>{data}</h1>
                    <button class="button" onClick={getadvice}><span>Get the Advices here</span></button>
                </div>
            </div>
  );
}

export default App;
