import React, { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimeSeriesData } from '../../types';

export interface NeuralLoadGraphProps {
  data: TimeSeriesData[];
  height?: number;
  showGrid?: boolean;
}

const NeuralLoadGraphComponent: React.FC<NeuralLoadGraphProps> = ({
  data,
  height = 300,
  showGrid = true,
}) => {
  // Memoize chart data formatting to avoid recalculation on every render
  const chartData = useMemo(() => 
    data.map(point => ({
      time: point.timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      load: point.value,
    })),
    [data]
  );

  return (
    <div className="relative bg-black border-2 border-deep-teal angular-frame p-6">
      <h3 className="text-xl font-cyber text-neon-green mb-4 uppercase tracking-wider">
        Neural Load Monitor
      </h3>
      
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0, 255, 170, 0.1)" 
              vertical={false}
            />
          )}
          <XAxis 
            dataKey="time" 
            stroke="#00FFAA"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
            tick={{ fill: '#00FFAA' }}
          />
          <YAxis 
            stroke="#00FFAA"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
            tick={{ fill: '#00FFAA' }}
            domain={[0, 100]}
            label={{ 
              value: 'Load %', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#00FFAA', fontSize: '14px' }
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#000',
              border: '2px solid #00FFAA',
              borderRadius: '0',
              color: '#00FFAA',
              fontFamily: 'Inter',
            }}
            labelStyle={{ color: '#00FFAA' }}
            itemStyle={{ color: '#00FFAA' }}
          />
          <defs>
            <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FFAA" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00FFAA" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Line 
            type="monotone" 
            dataKey="load" 
            stroke="#00FFAA" 
            strokeWidth={3}
            dot={{ fill: '#00FFAA', r: 4 }}
            activeDot={{ r: 6, fill: '#00FFAA', stroke: '#000', strokeWidth: 2 }}
            fill="url(#loadGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-400">Real-time monitoring</span>
        <span className="text-neon-green pulse-glow">● ACTIVE</span>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const NeuralLoadGraph = memo(NeuralLoadGraphComponent);
