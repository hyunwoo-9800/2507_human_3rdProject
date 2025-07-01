// src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")  // proxy 설정 덕분에 localhost:8080으로 전달됨
        .then(res => res.text())
        .then(data => setMessage(data))
        .catch(err => console.error("API 호출 오류:", err));
  }, []);

  return (
      <div>
        <h1>Spring Boot + React 연동</h1>
        <p>{message}</p>
      </div>
  );
}

export default App;
