import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

const DOMpurify = require('dompurify');
const marked = require("marked");
marked.setOptions({
  gfm: true,
  breaks: true,
});

function App() {

  const [input, setInput] = useState<any>("");
  const [dragging, setDragging] = useState<boolean>(false);
  const [editorStyle, setEditorStyle] = useState({width:"50%", height:"100%"});
  const [dragbarStyle, setDragbarStyle] = useState({left: "calc(50% - 5px)", top: "6vh", width: "10px", height: "calc(100% - 6vh)"});
  const [previewStyle, setPreviewStyle] = useState({width: "50%", height:"100%", "overflow-y": "auto"});
  const [undoEnabled, setUndoEnabled] = useState({display: "none"})
  const [prevInput, setPrevInput] = useState<any>("");
  const [mobile, setMobile] = useState<boolean>(true);

  useEffect(()=> {
    if (window.innerWidth > 600) {
      setMobile(false);
    } else {
      setMobile(true);
    }
  },[])

  useEffect(()=>{
    function handleResize () {
      if (window.innerWidth > 600) {
        setMobile(false);
      } else {
        setMobile(true);
      }
    } 
    window.addEventListener('resize', handleResize);
  });

  useEffect(()=> {
      if (mobile) {
        setEditorStyle({width:"100%", height: `calc((${window.innerHeight}px - 6vh) / 2)`});
        setPreviewStyle({width:"100%", height: `calc(${window.innerHeight}px - 6vh) / 2)`, "overflow-y": "auto"});
        setDragbarStyle({left:"0", top: `calc(50% + 6vh - 20px)`, height: "10px", width: "100%"});
      } else {
        setEditorStyle({width:"50%", height:"100%"});
        setPreviewStyle({width:"50%", height:"100%", "overflow-y": "auto"});
        setDragbarStyle({left: "calc(50% - 5px)", top: "6vh", width: "10px", height: "calc(100% - 6vh)"});
      }
  }, [mobile])

  function updateInput (event:any) {
    setPrevInput(input);
    setInput(event.target.value);
  };

  const dragBarRef = React.useRef<HTMLSpanElement>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const downloadBtnRef = React.useRef<HTMLAnchorElement>(null);

  
  const dragStart = (e:React.MouseEvent) => {
    setDragging(true);
  };

  const dragStartTouch = (e:React.TouchEvent) => {
    setDragging(true);
  };

  const dragMove = (e: React.MouseEvent) => {
    //mobile
    if (mobile) {
      const percent = window.innerHeight / 100;
      const headerHeight = percent * 6;
      const area = window.innerHeight - headerHeight;
      if (dragging && e.clientY > (percent * 21) && e.clientY < (percent * 85)) {
        setEditorStyle({width:"100%", height: `${e.clientY - headerHeight}px`});
        setPreviewStyle({width:"100%", height: `${area - e.clientY + headerHeight}px`, "overflow-y": "hidden"});
        setDragbarStyle({left:"0", top: `calc(${e.clientY}px - 5px)`, height: "10px", width: "100%"});
      };  
      //desktop
    } else {
      const percent = window.innerWidth / 100;
      if (dragging && e.clientX > (percent * 15) && e.clientX < (percent * 85)) {
        setEditorStyle({width: `${(window.innerWidth - (window.innerWidth - e.clientX))/percent}%`, height: "100%"});
        setPreviewStyle({width: `${(window.innerWidth - e.clientX)/percent}%`, height: "100%", "overflow-y": "auto"});
        setDragbarStyle({left: `calc(${(window.innerWidth - (window.innerWidth - e.clientX))/percent}% - 5px)`, top: "0px", width: "10px", height: "calc(100% - 6vh)"});
      };
    };
  };

  const dragMoveTouch = (e:React.TouchEvent) => { 
    //mobile
    if (mobile) {
      const percent = window.innerHeight / 100;
      const headerHeight = percent * 6;
      const area = window.innerHeight - headerHeight;
      if (dragging && e.touches[0].clientY > (percent * 15) && e.touches[0].clientY < (percent * 85)) {
        setEditorStyle({width:"100%", height: `${e.touches[0].clientY - headerHeight}px`});
        setPreviewStyle({width:"100%", height: `${area - e.touches[0].clientY + headerHeight}px`, "overflow-y": "hidden"});
        setDragbarStyle({left:"0", top: `calc(${e.touches[0].clientY}px - 5px)`, height: "10px", width: "100%"});
      };
    
    //desktop
    } else {
      const percent = window.innerWidth / 100;
      if (dragging && e.touches[0].clientX > (percent * 15) && e.touches[0].clientX < (percent * 85)) {
        setEditorStyle({width: `${(window.innerWidth - (window.innerWidth - e.touches[0].clientX))/percent}%`, height: "100%"});
        setPreviewStyle({width: `${(window.innerWidth - e.touches[0].clientX)/percent}%`, height: "100%", "overflow-y": "auto"});
        setDragbarStyle({left: `calc(${(window.innerWidth - (window.innerWidth - e.touches[0].clientX))/percent}% - 5px)`, top: "0px", width: "10px", height: "calc(100% - 6vh)"});
      };
    };
  };

  const dragEnd = (e:React.MouseEvent) => {
    if (dragging) {
      setDragging(false);
      setPreviewStyle({width: `${previewStyle.width}`, height: `${previewStyle.height}`, "overflow-y": "auto"});
    };
  };

  const dragEndTouch = (e:React.TouchEvent) => {
    if (dragging) {
      setDragging(false);
      setPreviewStyle({width: `${previewStyle.width}`, height: `${previewStyle.height}`, "overflow-y": "auto"});
    };
  };

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
    <div className="App" onMouseMove={dragMove} onTouchMove={dragMoveTouch} onMouseUp={dragEnd} onTouchEnd={dragEndTouch}>
      <header>
        <h1>Markdown Previewer</h1>
        <nav>
          <ul>
            <li onClick={undo} style={undoEnabled} title="undo">
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

      <span id="dragbar" ref={dragBarRef} onMouseDown={dragStart} onTouchStart={dragStartTouch} style={dragbarStyle}></span>

    </div>
  );
};

export default App;
