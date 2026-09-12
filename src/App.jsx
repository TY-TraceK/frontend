import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import GNB from "./components/GNB";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <GNB />
    </>
  );
}

export default App;
