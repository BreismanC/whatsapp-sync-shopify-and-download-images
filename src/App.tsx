import { Route, Routes } from "react-router";
import { Home, DownloadImages } from "./pages";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<div>404</div>} />
        <Route path="/download-images" element={<DownloadImages />} />
      </Routes>
    </>
  );
}

export default App;
