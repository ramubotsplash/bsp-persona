import { FormEvent } from 'react';
import { LogOut, Search, Loader2, AlertCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { useAppStore } from '@/stores/app-store';
import { LoginPage } from '@/components/LoginPage';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
const SkeletonLoader = () => (
  <div className="w-full space-y-6 mt-8">
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-10 w-1/3" />
    </div>
    <div className="space-y-4 border p-6 rounded-lg">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);
const MainApp = () => {
  const { query, setQuery, fetchEnrichmentData, isLoading, enrichmentData, error, logout } = useAppStore(
    useShallow((state) => ({
      query: state.query,
      setQuery: state.setQuery,
      fetchEnrichmentData: state.fetchEnrichmentData,
      isLoading: state.isLoading,
      enrichmentData: state.enrichmentData,
      error: state.error,
      logout: state.logout,
    }))
  );
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isQueryEmpty = Object.values(query).every((val) => val.trim() === '');
    if (isQueryEmpty) {
      toast.error('Please fill at least one search field.');
      return;
    }
    fetchEnrichmentData();
  };
  return (
    <div className="relative flex flex-col items-center min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-display text-foreground">Persona</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/history">
              <History className="w-4 h-4 mr-2" />
              History
            </Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
          <LogOut className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      </header>
      <main className="w-full max-w-4xl flex flex-col items-center flex-1">
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="w-full text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Unlock Actionable Insights
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Enter any details you have to enrich your data.
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
              <Label htmlFor="personName">Person Name</Label>
              <Input id="personName" placeholder="e.g., Jennifer Smith" value={query.personName} onChange={(e) => setQuery({ personName: e.target.value })} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g., VP of Sales" value={query.title} onChange={(e) => setQuery({ title: e.target.value })} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="e.g., iBusiness Funding" value={query.companyName} onChange={(e) => setQuery({ companyName: e.target.value })} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Info</Label>
              <Input id="additionalInfo" placeholder="e.g., LinkedIn URL, email" value={query.additionalInfo} onChange={(e) => setQuery({ additionalInfo: e.target.value })} disabled={isLoading} />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full text-base font-semibold">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Enrich
              </>
            )}
          </Button>
        </form>
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <SkeletonLoader />
            </motion.div>
          )}
          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 flex items-center gap-2 p-4 bg-red-500/10 rounded-md"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </motion.div>
          )}
          {enrichmentData && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl"
            >
              <ResultsDisplay data={enrichmentData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="w-full text-center py-4 mt-auto">
        <p className="text-xs text-muted-foreground/80">
          Built with ❤️ at Cloudflare
        </p>
      </footer>
    </div>
  );
};
export function HomePage() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-zinc-900 dark:to-black text-foreground">
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <motion.div key="main-app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MainApp />
          </motion.div>
        ) : (
          <motion.div key="login-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginPage />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster richColors closeButton />
    </div>
  );
}