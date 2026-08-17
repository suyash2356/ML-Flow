import { useEffect, useRef, useState } from 'react';
import './ProjectMenu.css';
const actions = ['Save', 'Save As', 'Import', 'Export', 'Duplicate', 'Project settings', 'Keyboard shortcuts', 'Reset workspace'];
export function ProjectMenu({ onAction }: { onAction: (action: string) => void }) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false); document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  return <div className="project-menu" ref={ref}><button className="project-menu__trigger" onClick={() => setOpen(!open)} aria-label="Project actions">•••</button>{open && <div className="project-menu__popover">{actions.map((action) => <button key={action} className={action === 'Reset workspace' ? 'project-menu__danger' : ''} onClick={() => { onAction(action); setOpen(false); }}>{action}</button>)}</div>}</div>;
}
