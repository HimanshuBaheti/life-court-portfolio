import Media from './Media';
import { ArrowUpRight } from 'lucide-react';

export default function MediaGrid({ items }) {
  return <div className="editorial-grid">{items.map((item, i) => <figure key={item.src} className={`travel-frame travel-frame-${i}`}>
    <Media media={item} />
    <div className="travel-date">{item.date}</div>
    <figcaption><div className="micro">{item.location}<ArrowUpRight size={15} /></div><h3>{item.title}</h3><p>{item.caption}</p></figcaption>
  </figure>)}</div>;
}
