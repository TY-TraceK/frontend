import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Place from "./pages/Place/Place";
import Header from "./components/Header";
import GNB from "./components/GNB";
import ContentDetail from "./pages/content/ContentDetail";
import VerifyFab from "./components/VerifyFab";
import VerifyModal from "./components/VerifyModal";

function App() {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<Place />} />
        <Route path="/content/detail" element={<ContentDetail />} />
      </Routes>

      <VerifyFab onClick={() => setIsVerifyOpen(true)} />

      <VerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      <GNB />
    </>
  );
}

export default App;
