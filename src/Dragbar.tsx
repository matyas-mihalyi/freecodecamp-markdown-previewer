import './Dragbar.css';
import { forwardRef, DragEvent } from 'react';

// type Props = {positionDragBar(e:React.DragEvent):void}

type Ref = HTMLSpanElement;

export const Dragbar = forwardRef<Ref>((props, ref) => {

  const positionDragBar = (e:DragEvent) => {
    console.log(e)
  }
  
  return (
    <span id="dragbar" ref={ref} onDrag={positionDragBar}>
      
    </span>
    
  )
}
) 