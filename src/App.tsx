import { ProviderTooltip } from './hook/useTooltip';
import useGeneralSetting from './hook/useGeneralSetting';
import MainDashboard from './components/MainDashboard';


function App() {
  const { ProviderStore, useStore } = useGeneralSetting()

  return (
    <ProviderStore>
      <ProviderTooltip>
        <MainDashboard />
      </ProviderTooltip>
    </ProviderStore>
  );


}

export default App
