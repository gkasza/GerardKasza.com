import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md text-center" data-testid="page-not-found">
        <p className="font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="font-heading text-2xl font-bold mt-4">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          There's nothing at this address. Everything on this site lives on the main page.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-sm text-primary hover:underline py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to gerardkasza.com
        </Link>
      </div>
    </div>
  );
}
