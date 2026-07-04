import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

function formatAxisValue(value) {
  if (typeof value !== 'number') return value;
  if (Math.abs(value) >= 10000000) return `${Math.round(value / 100000) / 100}Cr`;
  if (Math.abs(value) >= 100000) return `${Math.round(value / 1000) / 100}L`;
  if (Math.abs(value) >= 1000) return `${Math.round(value / 100) / 10}K`;
  return value;
}

export function ChartCard({ title, description, data, type = 'area', dataKey = 'value' }) {
  const Chart = type === 'bar' ? BarChart : AreaChart;
  const compactLabels = data.length > 0 && data.length <= 6;

  return (
    <Card className="min-w-0 max-w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-52 min-w-0 overflow-hidden sm:h-64 lg:h-72">
        <div className="h-full w-full min-w-0 max-w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <Chart data={data} margin={{ top: 8, right: 4, bottom: compactLabels ? 40 : 8, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={compactLabels ? -35 : 0}
                textAnchor={compactLabels ? 'end' : 'middle'}
                height={compactLabels ? 48 : 28}
                tick={{ fontSize: 10 }}
                tickMargin={4}
              />
              <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 10 }} tickFormatter={formatAxisValue} />
              <Tooltip />
              {type === 'bar' ? <Bar dataKey={dataKey} fill="#6C4DFF" radius={[10, 10, 0, 0]} /> : <Area dataKey={dataKey} type="monotone" stroke="#6C4DFF" fill="#6C4DFF" fillOpacity={0.18} />}
            </Chart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
