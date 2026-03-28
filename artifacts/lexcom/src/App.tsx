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
import Forum from "@/pages/Forum";
import ForumThread from "@/pages/ForumThread";
import Komunitas from "@/pages/Komunitas";
import LexBot from "@/pages/LexBot";
import Peraturan from "@/pages/Peraturan";
import Putusan from "@/pages/Putusan";
import Panduan from "@/pages/Panduan";
import PanduanDetail from "@/pages/PanduanDetail";
import Kursus from "@/pages/Kursus";
import KursusDetail from "@/pages/KursusDetail";
import Pengacara from "@/pages/Pengacara";
import PromoAdvokat from "@/pages/PromoAdvokat";
import Layanan from "@/pages/Layanan";
import Glosarium from "@/pages/Glosarium";
import Kalkulator from "@/pages/Kalkulator";
import RisetAI from "@/pages/RisetAI";
import TelaahDokumen from "@/pages/TelaahDokumen";
import PetaPreseden from "@/pages/PetaPreseden";
import PenulisCerdas from "@/pages/PenulisCerdas";
import ChatbotBuilder from "@/pages/ChatbotBuilder";
import EbookBuilder from "@/pages/EbookBuilder";
import Harga from "@/pages/Harga";
import Masuk from "@/pages/Masuk";
import Profil from "@/pages/Profil";
import IntelijenRegulasi from "@/pages/IntelijenRegulasi";
import { FloatingLexBot } from "@/components/FloatingLexBot";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
      <Route path="/forum/:id" component={ForumThread} />
      <Route path="/putusan" component={Putusan} />
      <Route path="/pengacara" component={Pengacara} />
      <Route path="/panduan" component={Panduan} />
      <Route path="/panduan/:id" component={PanduanDetail} />
      <Route path="/kursus/:id" component={KursusDetail} />
      <Route path="/komunitas" component={Komunitas} />
      <Route path="/lexbot" component={LexBot} />
      <Route path="/promo" component={PromoAdvokat} />
      <Route path="/glosarium" component={Glosarium} />
      <Route path="/kalkulator" component={Kalkulator} />
      <Route path="/riset-ai" component={RisetAI} />
      <Route path="/telaah-dokumen" component={TelaahDokumen} />
      <Route path="/peta-preseden" component={PetaPreseden} />
      <Route path="/penulis-cerdas" component={PenulisCerdas} />
      <Route path="/chatbot-builder" component={ChatbotBuilder} />
      <Route path="/ebook-builder" component={EbookBuilder} />
      <Route path="/harga" component={Harga} />
      <Route path="/masuk" component={Masuk} />
      <Route path="/profil" component={Profil} />
      <Route path="/intelijen-regulasi" component={IntelijenRegulasi} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <FloatingLexBot />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
