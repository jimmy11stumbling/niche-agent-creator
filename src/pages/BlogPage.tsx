
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Introducing Data Processing for AgentCreator",
      excerpt: "We're excited to announce our new data processing capabilities that make it easier than ever to prepare and transform your data for AI training.",
      author: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg",
        initials: "AJ",
      },
      date: new Date("2023-06-15"),
      category: "Product Updates",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "The Future of AI Agents in Customer Service",
      excerpt: "AI agents are transforming customer service. Learn how businesses are deploying conversational AI to improve customer satisfaction and reduce costs.",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg",
        initials: "SC",
      },
      date: new Date("2023-06-01"),
      category: "Industry Insights",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "Building Advanced Workflows: A Step-by-Step Guide",
      excerpt: "Learn how to create complex workflows with conditions, data processing, and integrations to automate your business processes.",
      author: {
        name: "Michael Rodriguez",
        avatar: "/placeholder.svg",
        initials: "MR",
      },
      date: new Date("2023-05-20"),
      category: "Tutorials",
      readTime: "12 min read",
    },
    {
      id: 4,
      title: "Best Practices for Training AI Agents",
      excerpt: "Improve your AI agent's performance with these proven training techniques and data preparation strategies.",
      author: {
        name: "Emily Wong",
        avatar: "/placeholder.svg",
        initials: "EW",
      },
      date: new Date("2023-05-10"),
      category: "Best Practices",
      readTime: "7 min read",
    },
    {
      id: 5,
      title: "AgentCreator 2.0: What's New",
      excerpt: "Discover all the new features and improvements in our latest major release, including enhanced workflow tools and data processing capabilities.",
      author: {
        name: "David Lee",
        avatar: "/placeholder.svg",
        initials: "DL",
      },
      date: new Date("2023-04-25"),
      category: "Product Updates",
      readTime: "6 min read",
    },
    {
      id: 6,
      title: "How AI is Transforming the Healthcare Industry",
      excerpt: "From patient care to administrative tasks, AI agents are helping healthcare providers improve efficiency and patient outcomes.",
      author: {
        name: "Lisa Kim",
        avatar: "/placeholder.svg",
        initials: "LK",
      },
      date: new Date("2023-04-15"),
      category: "Industry Insights",
      readTime: "10 min read",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AgentCreator Blog</h1>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">All</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Product Updates</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Tutorials</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Industry Insights</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(post.date, { addSuffix: true })}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 flex-grow">
                <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{post.author.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
