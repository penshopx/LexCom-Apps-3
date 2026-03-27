import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chatbots from "@/pages/Chatbots";
import Cases from "@/pages/Cases";
import Documents from "@/pages/Documents";
import Agents from "@/pages/Agents";
import AgentChat from "@/pages/AgentChat";
import {
  Layanan,
  Peraturan,
  Kursus,
  Forum,
  Putusan,
  Pengacara,
  Panduan,
  Komunitas,
} from "@/pages/ComingSoon";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agentic-chatbots" component={Chatbots} />
      <Route path="/agents" component={Agents} />
      <Route path="/agents/:agentKey" component={AgentChat} />
      <Route path="/cases" component={Cases} />
      <Route path="/documents" component={Documents} />
      <Route path="/layanan" component={Layanan} />
      <Route path="/peraturan" component={Peraturan} />
      <Route path="/kursus" component={Kursus} />
      <Route path="/forum" component={Forum} />
      <Route path="/putusan" component={Putusan} />
      <Route path="/pengacara" component={Pengacara} />
      <Route path="/panduan" component={Panduan} />
      <Route path="/komunitas" component={Komunitas} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
