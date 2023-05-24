import "./App.css";
import { WelcomePage } from "./WelcomePage/WelcomePage";
import { HelpModal } from "./Elements/HelpModal";
function App() {
  return (
    <div className="game-container">
      <WelcomePage />
      <HelpModal />
    </div>
  );
}

export default App;
