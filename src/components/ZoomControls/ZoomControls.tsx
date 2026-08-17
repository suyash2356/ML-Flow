import './ZoomControls.css';
export function ZoomControls({zoom,onChange,onFit}:{zoom:number;onChange:(n:number)=>void;onFit:()=>void}){return <div className="zoom-controls"><button onClick={()=>onChange(Math.max(.45,zoom-.1))}>−</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>onChange(Math.min(1.6,zoom+.1))}>+</button><button onClick={onFit}>Fit</button></div>}
