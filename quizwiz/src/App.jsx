// src/App.jsx
import AppRoutes from '../src/routes/Approuters';
import { useEffect, useState, useRef} from 'react';

export default function App() {
  const [inputValue, setInputValue] = useState("");  // 1️⃣
  const count = useRef(0);                           // 2️⃣

  useEffect(() => {
    count.current = count.current + 1;  
      console.log(count.current);
                 // 4️⃣
  }); // 3️⃣

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} // 5️⃣
      />
      <h1>Render Count: {count.current}</h1>
    </>
  );
}


