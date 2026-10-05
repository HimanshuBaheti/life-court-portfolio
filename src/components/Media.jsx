import { useState } from 'react';

export default function Media({ media, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  return <div className={`media ${className}`}>
    {!failed && <img src={media.src} alt={media.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={(event) => {
      if (media.fallback && event.currentTarget.getAttribute('src') !== media.fallback) event.currentTarget.src = media.fallback;
      else setFailed(true);
    }} />}
    {failed && <span className="media-fallback">{media.alt}</span>}
  </div>;
}
