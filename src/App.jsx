import LifeBlog from './prototype/LifeBlog';
import RallyApp from './prototype/RallyApp';
import SculptureApp from './prototype/SculptureApp';

export default function App() {
  if (new URLSearchParams(window.location.search).get('view') === 'blog') return <LifeBlog />;
  return new URLSearchParams(window.location.search).get('concept') === 'sculpture' ? <SculptureApp /> : <RallyApp />;
}
