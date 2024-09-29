import Header from "@components/Header";
import RoadmapPage from "@pages/roadmapPage";
import "./App.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Header />
        <RoadmapPage />
      </div>
    </QueryClientProvider>
  );
}
