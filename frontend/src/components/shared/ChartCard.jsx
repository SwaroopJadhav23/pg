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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ top: 8, right: 18, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={formatAxisValue} />
            <Tooltip />
            {type === 'bar' ? <Bar dataKey={dataKey} fill="#6C4DFF" radius={[10, 10, 0, 0]} /> : <Area dataKey={dataKey} type="monotone" stroke="#6C4DFF" fill="#6C4DFF" fillOpacity={0.18} />}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
