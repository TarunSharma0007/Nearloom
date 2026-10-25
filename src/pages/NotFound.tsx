import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="map-grid flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-16">
      <div className="max-w-2xl text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warning"><Compass className="h-7 w-7" /></span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-primary">404 · Off the map</p>
        <h1 className="mt-4 font-display text-6xl leading-[0.9] tracking-[-0.055em] md:text-8xl">This path doesn’t lead to a circle.</h1>
        <p className="mx-auto mt-6 max-w-lg leading-7 text-muted-foreground">The page may have moved, or the community may no longer be listed. There are plenty of other doors to try.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" size="lg" className="rounded-full"><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />Back home</Link></Button>
          <Button asChild size="lg" className="rounded-full"><Link to="/browse">Explore communities</Link></Button>
        </div>
      </div>
    </main>
  </div>
);

export default NotFound;
