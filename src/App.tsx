import Header from "./components/Header";
import Footer from "./components/Footer";
import RoadmapPage from "./pages/roadmapPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Header />
      <RoadmapPage />
      <Footer />
    </div>
  );
}
