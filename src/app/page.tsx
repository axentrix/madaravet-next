import HomeClient from '../components/HomeClient';
import Heatmap from '../components/Heatmap';

export default function Page() {
  return (
    <div id="home-page" className="page-home">
      <HomeClient />
      <Heatmap enabled={true} />
     </div>
  );
}
