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
  const [screenData, setScreenData] = useState("");
  const [response, setResponse] = useState("");

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
    .then(response => response.json())
    .then(result => {
      sendCommand(result);
      alert(`Command sent: ${result.response}`);
      setData("");
      setScreenData(result.screenData.binaryData);
      setResponse(result.response);
    })
    .catch(error => console.log('error', error));
  };

  return (
    <div>
      <input type="text" onChange={handleInputChange} value={data}/>
      <button onClick={handleClick}>Send</button>
      <div>Screen Data: {screenData}</div>
      <p>Response: {response}</p>
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