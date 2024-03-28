import React, { useState } from 'react';

function CommandLog({ log }: { log: string }) {
  return (
    <div>
      <textarea readOnly={true} value={log}/>
    </div>
  );
}

function CommandBox({sendCommand}: { sendCommand: (command: string) => void }) {
  const [data, setData] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value);  
  };

  const handleClick = () => {
    fetch('http://localhost:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: data })
    })
    .then(response => response.text())
    .then(result => {
      sendCommand(result);
      alert("FUCK");
      setData("");
    })
    .catch(error => console.log('error', error));
  };

  return (
    <div>
      <input type="text" onChange={handleInputChange} value={data}/>
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

function App() {
  const [log, setLog] = useState("");

  const sendCommand = (cmd: string) => {
    setLog(prevLog => prevLog + "\n" + cmd);
  };

  return (
    <div>
      <h1>Server Interface</h1>
      <CommandLog log={log}/>
      <CommandBox sendCommand={sendCommand}/>
    </div>
  );
}

export default App;