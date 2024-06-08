//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { VFC, useRef, useState, useEffect } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import Screenshot from '../../screenshot.png';

function AddFunction({className, sendCommand, bIsOpen}: {className: string, sendCommand: (command: string) => void, bIsOpen: (value: boolean) => void}) {
  return (
    <div className={className}>
      <h2>Add Function</h2>
      <input type="text" placeholder="Function Name"/>
      <Editor className='Editor' height="15vh" defaultLanguage="cpp" defaultValue="// Preferably copy and paste your code" theme='vs-dark'/>
      <button onClick={() => {bIsOpen(false)}}>Finish</button>
    </div>
  );
}

function CommandPanel({className, sendCommand}: {className: string, sendCommand: (command: string) => void}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      <h2>Command Panel</h2>
      <button>Open Chrome</button>
      <button className="addition-button" onClick={() => setIsOpen(!isOpen)}>+</button>
      {isOpen && <AddFunction className="add-script" sendCommand={sendCommand} bIsOpen={setIsOpen}/>}
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
    fetch('http://localhost:3001/send', {
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
      //setScreenData(result.screenData.binaryData);
      setResponse(result.response);
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
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(Screenshot);

  const sendCommand = (cmd: string) => {
    setLog(prevLog => prevLog + "\n" + cmd);
  };

  return (
    <div>
      <h1>Server Interface</h1>
      <div className="info-area">
        <CommandLog className="command-log" log={log}/>
        <img src={imageSrc} alt="screenshot" className="screenshot"></img>
      </div>
      <CommandBox sendCommand={sendCommand}/>
      <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "Close" : "Open"} Command Panel</button>
      {isOpen && <CommandPanel className="command-panel" sendCommand={sendCommand}/>}
    </div>
  );
}

export default App;
