import axios from "axios";
import { useState } from "react";

import './App.css';

function App() {
  const [data,setData] = useState("In order to get, you have to give.")

  // api for searching with the keywords 👇
  // https://api.adviceslip.com/advice/search/{query}

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
                <div class="content" style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly"}}>
                    <div>
                        <h1>{data}</h1> 
                    </div>
                    <div>  
                        <button class="button" onClick={getadvice}><span>Get the Advices here</span></button>
                    </div>              
                </div>
            </div>
  );
}

export default App;
