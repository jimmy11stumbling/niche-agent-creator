
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Brain, Rocket, Users, Shield, Globe, Award } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About AgentCreator</h1>
            <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
              We're on a mission to democratize AI agent creation and empower businesses to build 
              intelligent, conversational experiences without complex coding.
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="mb-4">
                Founded in 2022, AgentCreator was born from a simple observation: while large language models were 
                revolutionizing AI capabilities, the tools to effectively harness this power were reserved for technical experts.
              </p>
              <p className="mb-4">
                Our founding team of AI researchers and product designers came together with a shared vision: 
                to create a platform that makes advanced AI accessible to everyone, regardless of technical background.
              </p>
              <p>
                Today, AgentCreator is used by thousands of businesses worldwide to create custom AI agents 
                that power customer service, knowledge management, workflow automation, and much more.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/placeholder.svg" 
                alt="AgentCreator Team" 
                className="rounded-lg shadow-lg w-full" 
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Accessible Innovation</h3>
                <p>We believe advanced AI technology should be accessible to everyone, not just technical experts.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">User-Centered Design</h3>
                <p>We create products that prioritize the user experience, making complex technology intuitive and approachable.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Responsible AI</h3>
                <p>We are committed to developing AI tools that are ethical, transparent, and respect user privacy.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Rocket className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
                <p>We are constantly evolving our platform based on user feedback and emerging AI capabilities.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
                <p>We aim to empower businesses of all sizes, across all industries and regions, to benefit from AI.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p>We strive for excellence in everything we do, from product development to customer support.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "CEO & Co-founder",
                bio: "Former AI researcher at MIT with 10+ years of experience in machine learning.",
                image: "/placeholder.svg",
              },
              {
                name: "Michael Rodriguez",
                role: "CTO & Co-founder",
                bio: "Led engineering teams at major tech companies before founding AgentCreator.",
                image: "/placeholder.svg",
              },
              {
                name: "Emily Wong",
                role: "Chief Product Officer",
                bio: "Product design veteran with expertise in creating intuitive user experiences.",
                image: "/placeholder.svg",
              },
              {
                name: "David Lee",
                role: "Chief AI Officer",
                bio: "PhD in AI with multiple publications on conversational agents and NLP.",
                image: "/placeholder.svg",
              },
            ].map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-full w-32 h-32 object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Team</h2>
            <p className="max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals who share our passion for AI and creating 
              exceptional user experiences. Check out our open positions and join us on our mission.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              View Open Positions
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
