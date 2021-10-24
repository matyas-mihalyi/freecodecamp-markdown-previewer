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
  const [prevInput, setPrevInput] = useState<any>("");
  const [editorStyle, setEditorStyle] = useState({width:"50%"});
  const [dragbarStyle, setDragbarStyle] = useState({left: "calc(50% - 5px)"});
  const [previewStyle, setPreviewStyle] = useState({width: "50%"});
  

  function updateInput (event:any) {
    setPrevInput(input);
    setInput(event.target.value);
  };

  const dragBarRef = React.useRef<HTMLSpanElement>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const downloadBtnRef = React.useRef<HTMLAnchorElement>(null);

  
  const positionDragBar = (e:React.DragEvent) => {    
    if (e.clientX !== 0) {
      const percent = window.innerWidth / 100;
      setEditorStyle({width: `${(window.innerWidth - (window.innerWidth - e.clientX))/percent}%`});
      setPreviewStyle({width: `${100 - parseFloat(editorStyle.width.replace("%", ""))}%`})
      setDragbarStyle({left: `calc(${(window.innerWidth - (window.innerWidth - e.clientX))/percent}% - 5px)`});
    }
  }

  const placeholder = 
  `# Markdown Previewer
## powered by markedjs
This is my submission for the second project of the [freeCodeCamp front end development libraries](https://www.freecodecamp.org/learn/front-end-development-libraries/) curriculum.
You can write code in the editor between 2 backticks: \`<p>Hello World!</p>\`

You can also write multi-line code between three backticks:
\`\`\`
function sayHello(name) {
  return \`Hello \${name}!\`
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
    setInput("");
  };

  function undo () {
    setInput(prevInput)
  };

  return (
    <div className="App">
      <header>
        <h1>Markdown Previewer</h1>
        <nav>
          <ul>
            <li onClick={undo} title="clear editor">
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
      <div id="preview" ref={previewRef} style={previewStyle} dangerouslySetInnerHTML={{__html: DOMpurify.sanitize(marked(input))}}></div>
      <span id="dragbar" ref={dragBarRef} onDrag={positionDragBar} style={dragbarStyle}></span>
    </div>
  );
};

export default App;
