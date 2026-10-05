import { ArrowUpRight, Mail, Github, Linkedin, Instagram, Phone, FileText } from 'lucide-react';
import { connections } from '../content/connections';

export function publicHref(value) {
  return typeof value==='string'&&/^(https:\/\/|mailto:|tel:|\/(?!\/))\S+$/i.test(value)?value:null;
}
const icons={mail:Mail,github:Github,linkedin:Linkedin,instagram:Instagram,phone:Phone,file:FileText};

export default function ConnectionsPanel({ tab, onTab }) {
  return <div className="connections-content"><span className="match-eyebrow">DUBLIN, IRELAND / OPEN TO CONVERSATIONS</span><h2 id="connections-title">{tab==='projects'?'A closer look at the work.':connections.title}</h2><p>{connections.intro}</p><div className="connections-tabs" role="group" aria-label="Explore work and contact details"><button aria-pressed={tab==='connect'} onClick={()=>onTab('connect')}>Connect with me</button><button aria-pressed={tab==='projects'} onClick={()=>onTab('projects')}>Selected projects</button></div>
    {tab==='connect'?<div className="public-contacts">{connections.contacts.map(item=>{const Icon=icons[item.icon];const href=publicHref(item.href);return href?<a key={item.label} href={href} target={href.startsWith('https:')?'_blank':undefined} rel={href.startsWith('https:')?'noopener noreferrer':undefined}><Icon size={18}/><span>{item.label}<small>{item.value||'Open link'}</small></span><ArrowUpRight size={15}/></a>:<div className="contact-unconfigured" key={item.label}><Icon size={18}/><span>{item.label}<small>Details coming soon</small></span></div>;})}</div>:<div className="public-projects">{connections.projects.map(project=><article key={project.id}><span>{project.category}</span><h3>{project.title}</h3><p>{project.description}</p><div>{[['Live project',project.demo],['GitHub repository',project.repo]].map(([label,url])=>publicHref(url)?<a key={label} href={publicHref(url)} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={13}/></a>:<span key={label} className="project-link-pending">{label} · coming soon</span>)}</div></article>)}</div>}
  </div>;
}
