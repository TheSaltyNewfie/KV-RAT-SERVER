export function OpenChrome({sendCommand}: { sendCommand: (command: string) => void }) {
    
    const handleClick = () => {
        fetch('http://localhost:3001/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ command: "Execute 'chrome.exe'" })
        })
        .then(response => response.json())
        .then(result => {
          sendCommand(JSON.stringify(result));
          alert(`Command sent: ${result.response}`);
          //setData("");
          //setScreenData(result.screenData.binaryData);
          //setResponse(result.response);
        })
        .catch(error => console.log('error', error));
      };

    return (
        <div>
        <button onClick={handleClick}>Open Chrome</button>
        </div>
    );
}