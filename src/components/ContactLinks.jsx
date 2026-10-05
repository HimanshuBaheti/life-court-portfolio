import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { portfolioData as data } from '../content/portfolioData';

export default function ContactLinks() {
  return <div className="contact-links">{data.contacts.map((contact) => {
    const Icon = contact.icon === 'mail' ? Mail : contact.icon === 'download' ? Download : ArrowUpRight;
    return contact.href ? <a key={contact.label} href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{contact.label}<Icon size={16} /></a> : <span className="contact-pending" key={contact.label}>{contact.label}<small>{data.ui.comingSoon}</small></span>;
  })}</div>;
}
