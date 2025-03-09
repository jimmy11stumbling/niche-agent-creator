
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out! We'll get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="card-gradient shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card className="card-gradient shadow-lg">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Here are all the ways you can reach our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For general inquiries:<br />
                      <a href="mailto:info@example.com" className="text-primary hover:underline">
                        info@example.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      For technical support:<br />
                      <a href="mailto:support@example.com" className="text-primary hover:underline">
                        support@example.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Available Monday-Friday<br />
                      9:00 AM - 5:00 PM EST
                    </p>
                    <Button variant="outline" className="mt-2" onClick={() => 
                      toast({
                        title: "Live Chat",
                        description: "Live chat feature would open here in a real implementation.",
                      })
                    }>
                      Start Chat
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" onClick={() => 
                      toast({
                        title: "Social Media",
                        description: "Twitter/X profile would open here.",
                      })
                    }>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <span className="sr-only">Twitter</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => 
                      toast({
                        title: "Social Media",
                        description: "LinkedIn profile would open here.",
                      })
                    }>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => 
                      toast({
                        title: "Social Media",
                        description: "GitHub profile would open here.",
                      })
                    }>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                        <path d="M9 18c-4.51 2-5-2-7-2"></path>
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
