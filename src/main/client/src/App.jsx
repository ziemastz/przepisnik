import { useState } from 'react'
import './App.css'
import {Link} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
        <Link to={'/cake'}>Visit /cake</Link>
    </>
  )
}

export default App
