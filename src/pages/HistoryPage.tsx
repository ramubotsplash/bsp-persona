import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/stores/app-store';
import { useShallow } from 'zustand/react/shallow';
import { ArrowLeft, Search, AlertCircle, History as HistoryIcon, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import type { SearchHistoryEntry } from '@shared/types';
const HistorySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    ))}
  </div>
);
const EmptyState = () => (
  <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
    <div className="flex justify-center mb-4">
      <Search className="w-12 h-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold">No Search History</h3>
    <p className="text-muted-foreground mt-2">You haven't performed any searches yet. Your past searches will appear here.</p>
    <Button asChild className="mt-4">
      <Link to="/">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Start a New Search
      </Link>
    </Button>
  </div>
);
export function HistoryPage() {
  const { history, isHistoryLoading, historyError, fetchHistory } = useAppStore(
    useShallow((state) => ({
      history: state.history,
      isHistoryLoading: state.isHistoryLoading,
      historyError: state.historyError,
      fetchHistory: state.fetchHistory,
    }))
  );
  const [selectedEntry, setSelectedEntry] = useState<SearchHistoryEntry | null>(null);
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  const getQuerySummary = (query: SearchHistoryEntry['query']) => {
    const parts = [query.personName, query.title, query.companyName, query.additionalInfo].filter(Boolean);
    if (parts.length === 0) return "Empty Query";
    return parts.join(' / ');
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-zinc-900 dark:to-black text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
            >
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight flex items-center gap-3">
                  <HistoryIcon className="w-8 h-8 text-primary" />
                  Search History
                </h1>
                <p className="mt-1 text-muted-foreground">Review your past enrichment searches.</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Search
                </Link>
              </Button>
            </motion.div>
            <AnimatePresence mode="wait">
              {isHistoryLoading ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HistorySkeleton />
                </motion.div>
              ) : historyError ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 flex items-center gap-2 p-4 bg-red-500/10 rounded-md justify-center">
                  <AlertCircle className="w-5 h-5" />
                  <span>Error: {historyError}</span>
                </motion.div>
              ) : history.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EmptyState />
                </motion.div>
              ) : (
                <motion.div
                  key="history-list"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {history.map((entry) => (
                    <motion.div key={entry.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="truncate">{entry.data.person.job_title}</CardTitle>
                          <CardDescription>{new Date(entry.timestamp).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            <strong>Query:</strong> {getQuerySummary(entry.query)}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => setSelectedEntry(entry)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <footer className="text-center py-8">
            <p className="text-xs text-muted-foreground/80">
            Built with ���️ at Cloudflare
            </p>
        </footer>
      </div>
      <Dialog open={!!selectedEntry} onOpenChange={(isOpen) => !isOpen && setSelectedEntry(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Enrichment Details</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-6">
            {selectedEntry && <ResultsDisplay data={selectedEntry.data} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}