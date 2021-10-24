import React, { createElement } from 'react';
import './App.css';
import { useState, useEffect } from 'react';

const DOMpurify = require('dompurify');
const marked = require("marked");
marked.setOptions({
  gfm: true,
  breaks: true,
}

)

function App() {

  const [input, setInput] = useState<any>("");
  const [dragging, setDragging] = useState<boolean>(false);
  const [editorStyle, setEditorStyle] = useState({width:"50%"});
  const [dragbarStyle, setDragbarStyle] = useState({left: "calc(50% - 5px)"});
  const [previewStyle, setPreviewStyle] = useState({width: "50%"});
  // const [shield, setShield] = useState({display: "none"});
  const [undoEnabled, setUndoEnabled] = useState({display: "none"})
  const [prevInput, setPrevInput] = useState<any>("");

  

  function updateInput (event:any) {
    setPrevInput(input);
    setInput(event.target.value);
  };

  const dragBarRef = React.useRef<HTMLSpanElement>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const downloadBtnRef = React.useRef<HTMLAnchorElement>(null);

  
  const dragStart = (e:React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }

  const dragMove = (e:React.MouseEvent) => {
    const percent = window.innerWidth / 100;
    if (dragging && e.clientX > (percent * 15) && e.clientX < (percent * 85)) {
      setEditorStyle({width: `${(window.innerWidth - (window.innerWidth - e.clientX))/percent}%`});
      setPreviewStyle({width: `${(window.innerWidth - e.clientX)/percent}%`});
      setDragbarStyle({left: `calc(${(window.innerWidth - (window.innerWidth - e.clientX))/percent}% - 5px)`});
    }
  }

  const dragEnd = (e:React.MouseEvent) => {
    if (dragging) {
      setDragging(false);
    }
  }

  // function shieldOn (e:React.DragEvent) {
  //   e.preventDefault();
  //   console.log("on")
  //   setShield({display: "block"});
  // }

  // function shieldOff (e:React.DragEvent) {
  //   e.preventDefault();
  //   console.log("off")
  //   setShield({display: "none"});
  // }

  const placeholder = 
  `# Markdown Previewer
## powered by markedjs
This is my submission for the second project of the [freeCodeCamp front end development libraries](https://www.freecodecamp.org/learn/front-end-development-libraries/) curriculum.

You can write code in the editor between 2 backticks: \`<p>Hello World!</p>\`

You can also write multi-line code between three backticks:
\`\`\`
function sayHello(name) {
  return \`Hello \${name}!\`;
}
\`\`\`

You can make text **bold** or _italic_.

Use \> for 
> blockquotes

and \* for
* some
* list 
* items

You can even include images 
![alt text](https://github.com/n48.png "Logo Title")
`;

  useEffect(() => {
    setInput(placeholder)
  }, []);

  function downloadText () {
    //credit to Maria Campbell https://stackoverflow.com/a/42864235
    const downloadBtn:any = document.getElementById("download")!;
    const blob = new Blob([input], {type: 'text/plain'});
    const fileName = `${previewRef.current?.firstElementChild?.innerHTML.replace(/[\s\n\r]/g, "_")}.md`;
    downloadBtn.download = fileName;
    downloadBtn.href = window.URL.createObjectURL(blob);
    downloadBtn.target = `_blank`;
  };

  function clearEditior () {
    setPrevInput(input);
    setUndoEnabled({display: "block"});
    setInput("");
  };
  
  function undo () {
    setInput(prevInput);
    setUndoEnabled({display: "none"});
  };

 

  return (
    <div className="App" onMouseMove={dragMove} onMouseUp={dragEnd}>
      <header>
        <h1>Markdown Previewer</h1>
        <nav>
          <ul>
            <li onClick={undo} title="clear editor" style={undoEnabled}>
              <span className="material-icons-outlined">undo</span>
            </li>
            <li onClick={clearEditior} title="clear editor">
              <span className="material-icons-outlined">clear</span>
            </li>
            <li>
              <a onClick={downloadText} ref={downloadBtnRef} id="download" title="download md file">
              <span className="material-icons-outlined">file_download</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <textarea id="editor" onChange={updateInput} ref={editorRef} style={editorStyle} value={input} spellCheck="false"/>

      <div id="preview" ref={previewRef} style={previewStyle} dangerouslySetInnerHTML={{__html: DOMpurify.sanitize(marked(input))}} draggable="false"></div>

      <span id="dragbar" ref={dragBarRef} onMouseDown={dragStart} style={dragbarStyle} draggable="true"></span>

      {/* <div id="shield" style={shield}></div> */}
    </div>
  );
};

export default App;
