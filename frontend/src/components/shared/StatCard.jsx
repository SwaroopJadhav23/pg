import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function StatCard({ label, value, icon: Icon, tone = 'default', delta }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="min-w-0 max-w-full overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 break-words text-xl font-extrabold tracking-tight sm:text-2xl">{value}</p>
            </div>
            {Icon ? <div className="shrink-0 rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div> : null}
          </div>
          {delta ? <Badge variant={tone} className="mt-4">{delta}</Badge> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
