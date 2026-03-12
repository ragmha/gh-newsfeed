"use client";

import { FeedProvider } from "@/context/FeedProvider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { ArticlesGrid } from "@/components/ArticlesGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <FeedProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <FilterBar />
        <main className="flex-1 w-full px-3 sm:px-4 pt-0 pb-4">
          <ArticlesGrid />
        </main>
        <Footer />
      </div>
      <Toaster />
    </FeedProvider>
  );
}
