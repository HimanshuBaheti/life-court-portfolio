import RallyApp from './prototype/RallyApp';
import SculptureApp from './prototype/SculptureApp';

export default function App() {
  return new URLSearchParams(window.location.search).get('concept') === 'sculpture' ? <SculptureApp /> : <RallyApp />;
}
