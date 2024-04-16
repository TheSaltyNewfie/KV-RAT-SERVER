import React, { useState } from 'react';
import screenshot from './screenshot.png';
import './App.css';
import {OpenChrome} from './CommandButtons';


function CommandPanel({className, sendCommand}: {className: string, sendCommand: (command: string) => void}) {
  return (
    <div className={className}>
      <h2>Command Panel</h2>
      <OpenChrome sendCommand={sendCommand}/>
    </div>
  );
}

function CommandLog({className, log}: {className: string, log: string}) {
  return (
    <div className={className}>
      <code className={className}>{log}</code>
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
    fetch('http://71.7.252.234:3001/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ command: data })
    })
    .then(response => response.json())
    .then(result => {
      sendCommand(JSON.stringify(result));
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
      <CommandLog className="command-log" log={log}/>
      <CommandBox sendCommand={sendCommand}/>
      <img src={screenshot} className="screenshot"></img>
      <CommandPanel sendCommand={sendCommand} className="command-panel"/>
    </div>
  );
}

export default App;