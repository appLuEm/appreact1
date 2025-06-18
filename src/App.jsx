import { BrowserRouter, Routes, Route } from "react-router-dom";
import StreamingApp from "./components/StreamingApp";
import VideoPlayerPage from "./components/VideoPlayerPage";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import SeriesDetail from './pages/SeriesDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StreamingApp />} />
        <Route path="/watch/:id" element={<VideoPlayerPage />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
