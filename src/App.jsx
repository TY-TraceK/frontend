import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Place from "./pages/Place/Place";
import Header from "./components/Header";
import GNB from "./components/GNB";
import ContentDetail from "./pages/content/ContentDetail";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<Place />} />
        <Route path="/content/detail" element={<ContentDetail />} />
      </Routes>
      <GNB />
    </>
  );
}

export default App;
