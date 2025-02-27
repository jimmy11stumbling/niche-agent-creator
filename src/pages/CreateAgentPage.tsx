
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCreator from "@/components/AgentCreator";

const CreateAgentPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <AgentCreator />
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgentPage;
