import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { motion } from 'framer-motion';
export function LoginPage() {
  const login = useAppStore((state) => state.login);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tight text-foreground">
            Persona
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            AI-powered data enrichment for modern outreach.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            onClick={login}
            size="lg"
            className="w-full text-base font-semibold group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
          >
            <Chrome className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
            Sign in with Google
          </Button>
        </motion.div>
        <p className="mt-6 text-xs text-muted-foreground/80">
          Built with ❤️ at Cloudflare
        </p>
      </motion.div>
    </div>
  );
}