import Home from "./pages/Home";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Experience from "./pages/Experience";
import Work from "./pages/Work";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/work" element={<Work />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
