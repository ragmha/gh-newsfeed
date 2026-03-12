"use client";

import { FeedProvider } from "@/context/FeedProvider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { Controls } from "@/components/Controls";
import { AISummary } from "@/components/AISummary";
import { ArticlesGrid } from "@/components/ArticlesGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <FeedProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <FilterBar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <AISummary />
          <Controls />
          <ArticlesGrid />
        </main>
        <Footer />
      </div>
      <Toaster />
    </FeedProvider>
  );
}
