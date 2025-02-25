import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SoloMode from "./pages/soloMode";
import MultiplayerGame from "./pages/multiplayer";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SoloMode />} />
      <Route path="/multiplayer" element={<MultiplayerGame />} />
    </Routes>
  );
};

export default AppRoutes;
