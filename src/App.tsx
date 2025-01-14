import Header from "@components/Header";
import RoadmapPage from "@pages/roadmapPage";
import "./App.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AlertSnackBar from "@components/AlertSnackbar/AlertSnackbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <AlertSnackBar />
        <Header />
        <RoadmapPage />
        <Analytics />
        <SpeedInsights />
      </div>
    </QueryClientProvider>
  );
}
