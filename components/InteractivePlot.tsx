import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ReferenceLine } from 'recharts';
import { DataPoint } from '../types';

interface InteractivePlotProps {
  data: DataPoint[];
}

export const InteractivePlot: React.FC<InteractivePlotProps> = ({ data }) => {
  const [intercept, setIntercept] = useState(20);
  const [slope, setSlope] = useState(10);
  const [showSolution, setShowSolution] = useState(false);

  const { rss, residualsData } = useMemo(() => {
    let sumOfSquares = 0;
    const resData = [];
    for (const point of data) {
      const predictedY = slope * point.x + intercept;
      const error = point.y - predictedY;
      sumOfSquares += error * error;
      resData.push({ x: point.x, y1: point.y, y2: predictedY });
    }
    return { rss: sumOfSquares, residualsData: resData };
  }, [data, slope, intercept]);
  
  const optimalParams = useMemo(() => {
    const n = data.length;
    if (n === 0) return { intercept: 0, slope: 0, rss: 0 };
    const sumX = data.reduce((acc, p) => acc + p.x, 0);
    const sumY = data.reduce((acc, p) => acc + p.y, 0);
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    let numerator = 0;
    let denominator = 0;
    for (const p of data) {
      numerator += (p.x - meanX) * (p.y - meanY);
      denominator += (p.x - meanX) ** 2;
    }

    const optSlope = denominator === 0 ? 0 : numerator / denominator;
    const optIntercept = meanY - optSlope * meanX;
    
    let optRss = 0;
    for (const p of data) {
        optRss += (p.y - (optSlope * p.x + optIntercept)) ** 2;
    }

    return { intercept: optIntercept, slope: optSlope, rss: optRss };
  }, [data]);

  const userLineData = useMemo(() => {
    const xValues = data.map(p => p.x);
    const minX = Math.min(...xValues, 0);
    const maxX = Math.max(...xValues, 40);
    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept },
    ];
  }, [slope, intercept, data]);

  const optimalLineData = useMemo(() => {
    const { intercept: optIntercept, slope: optSlope } = optimalParams;
    const xValues = data.map(p => p.x);
    const minX = Math.min(...xValues, 0);
    const maxX = Math.max(...xValues, 40);
    return [
      { x: minX, y: optSlope * minX + optIntercept },
      { x: maxX, y: optSlope * maxX + optIntercept },
    ];
  }, [optimalParams, data]);

  const handleShowSolution = () => {
    setShowSolution(true);
    setIntercept(optimalParams.intercept);
    setSlope(optimalParams.slope);
  };
  
  return (
    <div className="bg-slate-900/50 rounded-lg p-4 my-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" dataKey="x" name="Temp" unit="°C" domain={[0, 40]} stroke="#94a3b8" />
            <YAxis type="number" dataKey="y" name="Sales" unit="$" domain={[0, 350]} stroke="#94a3b8" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <ZAxis type="number" range={[100]} />
            <Scatter name="Sales Data" data={data} fill="#00BFFF" shape="circle" />
            {residualsData.map((res, i) => (
              <ReferenceLine key={i} segment={[{ x: res.x, y: res.y1 }, { x: res.x, y: res.y2 }]} stroke="#f8717180" strokeWidth={1} />
            ))}
            <Line type="monotone" dataKey="y" data={userLineData} stroke="#4ade80" strokeWidth={3} dot={false} name="Your Line" />
            {showSolution && <Line type="monotone" dataKey="y" data={optimalLineData} stroke="#facc15" strokeWidth={3} dot={false} name="Optimal Line" strokeDasharray="5 5"/>}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-slate-800 rounded-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900 p-3 rounded-lg">
                <div className="text-sm text-slate-400">Your RSS</div>
                <div className="text-2xl font-bold text-brand-blue">{Math.round(rss).toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 p-3 rounded-lg">
                <div className="text-sm text-slate-400">Minimum RSS</div>
                <div className={`text-2xl font-bold ${showSolution ? 'text-yellow-400' : 'text-slate-500'}`}>{showSolution ? Math.round(optimalParams.rss).toLocaleString() : '???'}</div>
            </div>
            <button onClick={handleShowSolution} className="sm:col-span-1 bg-brand-accent hover:bg-brand-blue text-white font-bold py-2 px-4 rounded-lg transition-colors">Show Optimal Fit</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="intercept" className="block mb-1 text-sm font-medium text-slate-400">
              Intercept (&beta;<sub>0</sub>): {intercept.toFixed(1)}
            </label>
            <input id="intercept" type="range" min="-100" max="200" step="0.5" value={intercept} onChange={(e) => setIntercept(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div>
            <label htmlFor="slope" className="block mb-1 text-sm font-medium text-slate-400">
              Slope (&beta;<sub>1</sub>): {slope.toFixed(2)}
            </label>
            <input id="slope" type="range" min="-5" max="15" step="0.1" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};