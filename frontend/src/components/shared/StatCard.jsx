import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export function StatCard({ label, value, icon: Icon, tone = 'default', delta }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-extrabold tracking-tight">{value}</p>
            </div>
            {Icon ? <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div> : null}
          </div>
          {delta ? <Badge variant={tone} className="mt-4">{delta}</Badge> : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
