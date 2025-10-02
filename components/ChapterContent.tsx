import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { InteractivePlot } from './InteractivePlot';
import { ICE_CREAM_DATA } from '../constants';

// --- Reusable UI Components ---

const ChapterWrapper: React.FC<{ title: string, subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="bg-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl animate-fade-in">
    <h2 className="text-2xl sm:text-3xl font-bold text-brand-blue mb-2">{title}</h2>
    {subtitle && <h3 className="text-lg text-slate-400 mb-6 border-b-2 border-slate-700 pb-3">{subtitle}</h3>}
    <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">{children}</div>
  </div>
);

const Code: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-slate-900 text-brand-blue rounded-md px-2 py-1 font-mono text-sm sm:text-base">{children}</code>
);

interface QuizOption {
  text: React.ReactNode;
  isCorrect: boolean;
  feedback: React.ReactNode;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
}

const Quiz: React.FC<QuizProps> = ({ question, options }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (!answered) {
      setSelected(index);
      setAnswered(true);
    }
  };

  const getButtonClass = (index: number) => {
    if (!answered) return 'bg-slate-700 hover:bg-slate-600';
    if (options[index].isCorrect) return 'bg-green-500/50 border-green-500';
    if (index === selected) return 'bg-red-500/50 border-red-500';
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="my-6 p-6 bg-slate-900/50 rounded-lg">
      <p className="font-semibold mb-4">{question}</p>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <button key={index} onClick={() => handleSelect(index)} disabled={answered}
            className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition-all duration-300 ${getButtonClass(index)}`}>
            {option.text}
          </button>
        ))}
      </div>
      {answered && selected !== null && (
        <div className="mt-4 p-4 bg-slate-800 rounded-lg animate-fade-in">
          <p className={options[selected].isCorrect ? "text-green-300" : "text-red-300"}>
            {options[selected].feedback}
          </p>
        </div>
      )}
    </div>
  );
};


// --- Chapter 1: The Prediction Game ---
const C1S1: React.FC = () => (
  <ChapterWrapper title="Chapter 1: The Prediction Game" subtitle="Step 1: Finding the Pattern">
    <p>Machine learning is about finding a rule in data we've seen to make guesses about data we haven't. You're already an expert at this.</p>
    <p>Consider this sequence:</p>
    <p className="text-2xl font-mono text-center my-4 tracking-widest text-brand-accent">3, 6, 9, 12, 15, 18, 21, 24, ...</p>
    <Quiz
      question="What number comes next?"
      options={[
        { text: '26', isCorrect: false, feedback: "Not quite. Look at the difference between consecutive numbers, like 6-3 and 9-6. Is it consistent?" },
        { text: '27', isCorrect: true, feedback: "Perfect! You've spotted the pattern. Let's formalize it in the next step." },
        { text: '30', isCorrect: false, feedback: "That's a jump of 6 from 24. The sequence seems to be increasing by a smaller, more regular amount." }
      ]}
    />
  </ChapterWrapper>
);
const C1S2: React.FC = () => (
    <ChapterWrapper title="Chapter 1: The Prediction Game" subtitle="Step 2: Defining the Rule">
        <p>You saw the pattern was "add 3 each time". We can formalize this. If we call the number's place in the sequence its "Position", the rule is:</p>
        <div className="text-center my-4 p-4 bg-slate-900/50 rounded-lg font-mono text-brand-blue">
            Number = 3 &times; Position
        </div>
        <p>You've just "learned" a function from data. This is the core idea of predictive modeling.</p>
    </ChapterWrapper>
);

// --- Chapter 2: From Perfect to Plausible ---
const C2S1: React.FC = () => (
    <ChapterWrapper title="Chapter 2: From Perfect to Plausible" subtitle="Step 1: Dealing with Messy Data">
        <p>That last example was easy because the rule was perfect. Real-world data is messy.</p>
        <p>Let's run an ice cream shop. We believe temperature affects sales. We've collected some data on hot days:</p>
        <div className="h-80 my-4 bg-slate-900/50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis type="number" dataKey="x" name="Temperature (°C)" unit="°C" domain={[0, 40]} stroke="#94a3b8" />
                    <YAxis type="number" dataKey="y" name="Sales ($)" unit="$" domain={[0, 350]} stroke="#94a3b8" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Sales Data" data={ICE_CREAM_DATA} fill="#00BFFF" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
        <p>There's no single, perfect line that hits every point. But can you see a general trend?</p>
    </ChapterWrapper>
);
const C2S2: React.FC = () => {
    const lineAData = [{x: 0, y: 100}, {x: 40, y: 120}];
    const lineBData = [{x: 0, y: 60}, {x: 40, y: 250}];
    const lineCData = [{x: 0, y: 40}, {x: 40, y: 350}];
    return (
        <ChapterWrapper title="Chapter 2: From Perfect to Plausible" subtitle="Step 2: Finding the 'Best' Line">
            <p>We can try to draw a line to summarize the trend. But which line is the "best" summary?</p>
            <div className="h-80 my-4 bg-slate-900/50 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" dataKey="x" name="Temperature (°C)" unit="°C" domain={[0, 40]} stroke="#94a3b8" />
                        <YAxis type="number" dataKey="y" name="Sales ($)" unit="$" domain={[0, 350]} stroke="#94a3b8" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Sales Data" data={ICE_CREAM_DATA} fill="#00BFFF" />
                        <Line data={lineAData} dataKey="y" stroke="#f87171" strokeWidth={3} dot={false} name="Line A" />
                        <Line data={lineBData} dataKey="y" stroke="#4ade80" strokeWidth={3} dot={false} name="Line B" />
                        <Line data={lineCData} dataKey="y" stroke="#facc15" strokeWidth={3} dot={false} name="Line C" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <Quiz
                question="Which line feels like the 'best' summary of the data?"
                options={[
                    { text: <><span className="text-red-400 font-bold">Line A</span></>, isCorrect: false, feedback: "This line seems too flat. It suggests temperature has very little effect on sales, which doesn't match the data's upward trend." },
                    { text: <><span className="text-green-400 font-bold">Line B</span></>, isCorrect: true, feedback: 'Exactly! Line B seems to capture the "centre of gravity" of the data cloud. But "feels best" isn\'t a scientific algorithm. We need a way to quantify what makes a line good or bad.' },
                    { text: <><span className="text-yellow-400 font-bold">Line C</span></>, isCorrect: false, feedback: "This line looks too steep. It seems to overestimate sales, especially at lower temperatures, and miss the central trend." }
                ]}
            />
        </ChapterWrapper>
    );
};

// --- Chapter 3: Discovering "The Best" Line ---
const C3S1: React.FC = () => (
    <ChapterWrapper title="Chapter 3: Discovering 'The Best' Line" subtitle="Step 1: Which Line Wins?">
        <p>Three different lines try to summarize our data. Each has been scored using three different methods. Your gut probably tells you one line looks best—but which scoring method agrees with your intuition?</p>
        <ResidualMethodComparison />
        <p className="mt-4 text-center text-slate-400 italic">Study the patterns in the scores. What makes a "good" score? We'll unpack this mystery in the next step...</p>
    </ChapterWrapper>
);

interface LineResult {
    slope: number;
    intercept: number;
    color: string;
    sum: number;
    sumAbs: number;
    sumSq: number;
    residuals: number[];
}

const ResidualMethodComparison: React.FC = () => {
  const data = useMemo(() => [{x: 1, y: 2}, {x: 2, y: 3.1}, {x: 3, y: 3.9}, {x: 4, y: 5}, {x: 5, y: 12}], []);
  
  // FIX: Explicitly type `lines` to ensure TypeScript correctly infers the type of `params` after Object.entries.
  const lines: Record<string, { slope: number; intercept: number; color: string; }> = useMemo(() => ({
    "Line A (OLS Compromise)": { slope: 2.1, intercept: -0.54, color: "#4ade80" }, 
    "Line B (Robust Fit)": { slope: 1, intercept: 1, color: "#facc15" }, 
    "Line C (Misleading Sum)": { slope: 5, intercept: -10, color: "#f87171" }, 
  }), []);

  const calculateErrors = (data: {x: number, y: number}[], slope: number, intercept: number) => {
    const residuals = data.map(p => p.y - (slope * p.x + intercept));
    const sum = residuals.reduce((a, b) => a + b, 0);
    const sumAbs = residuals.reduce((a, b) => a + Math.abs(b), 0);
    const sumSq = residuals.reduce((a, b) => a + b * b, 0);
    return { sum, sumAbs, sumSq, residuals };
  };

  const results: Record<string, LineResult> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(lines).map(([name, params]) => [name, {...params, ...calculateErrors(data, params.slope, params.intercept)}])
    );
  }, [data, lines]);
  
  return (
    <div className="my-6 p-4 bg-slate-900/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className="bg-slate-800 p-4 rounded-lg">
            <h4 className={`text-lg font-bold text-center mb-2`} style={{color: result.color}}>{name.split(' (')[0]}</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <XAxis type="number" dataKey="x" domain={[0, 6]} hide />
                  <YAxis type="number" dataKey="y" domain={[0, 15]} hide />
                  <Scatter data={data} fill="#00BFFF" />
                  {data.map((p, i) => (
                    <ReferenceLine key={i} segment={[{x: p.x, y: p.y}, {x: p.x, y: result.slope * p.x + result.intercept}]} stroke={result.color} strokeOpacity={0.5} />
                  ))}
                  <Line data={[{x: 0, y: result.intercept}, {x: 6, y: result.slope * 6 + result.intercept}]} dataKey="y" stroke={result.color} strokeWidth={2} dot={false} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <div className="flex justify-between bg-slate-900 p-2 rounded"><span>Sum of Residuals:</span> <span className="font-mono">{result.sum.toFixed(1)}</span></div>
              <div className="flex justify-between bg-slate-900 p-2 rounded"><span>Sum of Absolutes:</span> <span className="font-mono">{result.sumAbs.toFixed(1)}</span></div>
              <div className="flex justify-between bg-slate-900 p-2 rounded"><span>Sum of Squares:</span> <span className="font-mono">{result.sumSq.toFixed(1)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const C3S2: React.FC = () => (
    <ChapterWrapper title="Chapter 3: Discovering 'The Best' Line" subtitle="Step 2: Understanding Error">
        <p>To understand those scores, we first need to understand how we measure error. A good line should have small prediction errors.</p>
        <p>The error for a single data point is the vertical distance between the actual point and our line's prediction. This distance is called a <strong>residual</strong>.</p>
        <div className="text-center my-4">
             <svg width="250" height="180" viewBox="0 0 250 180" className="mx-auto bg-slate-900/50 rounded-lg">
                <line x1="20" y1="160" x2="230" y2="40" stroke="#4ade80" strokeWidth="2" />
                <circle cx="150" cy="60" r="5" fill="#00BFFF" />
                <line x1="150" y1="60" x2="150" y2="90" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" />
                <text x="160" y="80" fill="#f87171" fontSize="14">Residual</text>
                <text x="140" y="55" fill="#00BFFF" fontSize="14">Actual Data</text>
                <text x="170" y="110" fill="#4ade80" fontSize="14">Predicted Value</text>
                <circle cx="150" cy="90" r="3" fill="#4ade80" />
            </svg>
        </div>
        <p>To measure a line's total error, we need to combine all the individual residuals. The three methods you saw earlier represent three different ways to do this!</p>
    </ChapterWrapper>
);
const C3S3: React.FC = () => (
    <ChapterWrapper title="Chapter 3: Discovering 'The Best' Line" subtitle="Step 3: Which Method Is Best?">
        <p>Now that you understand residuals, let's revisit those scoring methods. Each one combines errors differently.</p>
        <ResidualMethodComparison />
        <Quiz
            question="The OLS algorithm's goal is to find the one line with the minimum possible error. Looking at the three lines above, which error method does OLS use?"
            options={[
                { text: 'Method 1: Sum of all residuals.', isCorrect: false, feedback: "Look at Line C. This method gives it a near-perfect score of ~1.0, but it's clearly a terrible fit. This method is unreliable because positive and negative errors cancel out." },
                { text: 'Method 2: Sum of absolute values of residuals.', isCorrect: false, feedback: "A clever observation! This method prefers Line B, which hugs the majority of the data and has the lowest score (6.2). This is a valid approach called 'Least Absolute Deviations'. However, OLS works differently..." },
                { text: 'Method 3: Sum of the squares of the residuals.', isCorrect: true, feedback: "Correct! OLS uses this method and chooses Line A because it has the lowest score (16.3). Squaring the residuals heavily punishes the huge error on Line B (6*6=36!). OLS avoids large errors at all costs, even if it means being a bit further from the other points." }
            ]}
        />
    </ChapterWrapper>
);
const C3S4: React.FC = () => (
    <ChapterWrapper title="Chapter 3: Discovering 'The Best' Line" subtitle="Step 4: Ordinary Least Squares">
        <p>You've just discovered the core principle of <strong>Ordinary Least Squares (OLS)</strong>! The "best" line is the one that minimizes the <strong>Residual Sum of Squares (RSS)</strong>.</p>
        <p>This method is the foundation of linear regression because it's mathematically convenient and effectively punishes large mistakes, forcing the line to fit all points reasonably well.</p>
        <div className="text-center my-4 p-4 bg-slate-900/50 rounded-lg font-mono text-brand-blue">
            RSS = error<sub>1</sub><sup>2</sup> + error<sub>2</sub><sup>2</sup> + &hellip; + error<sub>n</sub><sup>2</sup>
        </div>
    </ChapterWrapper>
);

// --- Chapter 4: Building the Machine ---
const C4S1: React.FC = () => (
    <ChapterWrapper title="Chapter 4: Building the Machine" subtitle="Step 1: Your Turn to be the Machine!">
      <p className="font-bold text-xl text-center text-green-400">Find the best-fitting line!</p>
      <p className="text-center text-slate-400 mb-4">Use the two sliders below to adjust the line. Try to make the "RSS" score as small as possible. Don't worry what the controls mean yet—just experiment!</p>
      <InteractivePlot data={ICE_CREAM_DATA} />
    </ChapterWrapper>
);
const C4S2: React.FC = () => (
    <ChapterWrapper title="Chapter 4: Building the Machine" subtitle="Step 2: What You Just Controlled">
      <p>You just discovered the two "control knobs" of any straight line! Here's what you were adjusting:</p>
      <ul className="list-disc list-inside my-4 pl-4 space-y-2">
          <li><strong>&beta;<sub>0</sub> (Intercept):</strong> Where the line crosses the vertical (Y) axis. Move this to shift the line up or down.</li>
          <li><strong>&beta;<sub>1</sub> (Slope):</strong> How steep the line is. This tells us how much Y changes for a one-unit change in X.</li>
      </ul>
      <p>Together, they define the equation: <Code>Y-hat = &beta;<sub>0</sub> + &beta;<sub>1</sub> * X</Code>, where Y-hat is our prediction.</p>
      <p>Your goal was to minimize <strong>RSS</strong> (Residual Sum of Squares)—exactly what the OLS algorithm does!</p>
    </ChapterWrapper>
);
const C4S3: React.FC = () => (
    <ChapterWrapper title="Chapter 4: Building the Machine" subtitle="Step 3: The OLS Algorithm">
        <p>You probably got close to the best line, but finding the exact minimum by hand is tough. That's where the machine comes in.</p>
        <p>The <strong>OLS algorithm</strong> uses calculus (specifically, derivatives) to find the precise values for &beta;<sub>0</sub> and &beta;<sub>1</sub> that minimize the RSS. It does what you just did, but perfectly and instantly.</p>
        <p>From now on, we'll let the algorithm find the best line for us. Our job is to understand and evaluate the result.</p>
    </ChapterWrapper>
);


// --- Chapter 5: Is Our Model Any Good? ---
const BaselineComparison: React.FC = () => {
    const avgY = useMemo(() => ICE_CREAM_DATA.reduce((sum, p) => sum + p.y, 0) / ICE_CREAM_DATA.length, []);
    const olsSlope = 5.5;
    const olsIntercept = 45;
    const baselineData = [{x: 0, y: avgY}, {x: 40, y: avgY}];
    const olsData = [{x: 0, y: olsIntercept}, {x: 40, y: olsSlope * 40 + olsIntercept}];
    
    const calculateTSS = useMemo(() => {
        return ICE_CREAM_DATA.reduce((sum, p) => sum + Math.pow(p.y - avgY, 2), 0);
    }, [avgY]);
    
    const calculateRSS = useMemo(() => {
        return ICE_CREAM_DATA.reduce((sum, p) => {
            const pred = olsSlope * p.x + olsIntercept;
            return sum + Math.pow(p.y - pred, 2);
        }, 0);
    }, []);
    
    return (
        <div className="my-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold text-red-400 text-center mb-2">Baseline: Always Guess Average</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis type="number" dataKey="x" domain={[0, 40]} stroke="#94a3b8" />
                                <YAxis type="number" dataKey="y" domain={[0, 350]} stroke="#94a3b8" />
                                <Scatter data={ICE_CREAM_DATA} fill="#00BFFF" />
                                {ICE_CREAM_DATA.map((p, i) => (
                                    <ReferenceLine key={i} segment={[{x: p.x, y: p.y}, {x: p.x, y: avgY}]} stroke="#f87171" strokeOpacity={0.6} strokeWidth={2} />
                                ))}
                                <Line data={baselineData} dataKey="y" stroke="#f87171" strokeWidth={3} dot={false} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center">
                        <div className="text-sm text-slate-400">Total Sum of Squares (TSS)</div>
                        <div className="text-2xl font-mono text-red-400">{calculateTSS.toFixed(0)}</div>
                    </div>
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-lg">
                    <h4 className="text-lg font-bold text-green-400 text-center mb-2">OLS Model: Use Temperature</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis type="number" dataKey="x" domain={[0, 40]} stroke="#94a3b8" />
                                <YAxis type="number" dataKey="y" domain={[0, 350]} stroke="#94a3b8" />
                                <Scatter data={ICE_CREAM_DATA} fill="#00BFFF" />
                                {ICE_CREAM_DATA.map((p, i) => {
                                    const pred = olsSlope * p.x + olsIntercept;
                                    return <ReferenceLine key={i} segment={[{x: p.x, y: p.y}, {x: p.x, y: pred}]} stroke="#4ade80" strokeOpacity={0.6} strokeWidth={2} />;
                                })}
                                <Line data={olsData} dataKey="y" stroke="#4ade80" strokeWidth={3} dot={false} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center">
                        <div className="text-sm text-slate-400">Residual Sum of Squares (RSS)</div>
                        <div className="text-2xl font-mono text-green-400">{calculateRSS.toFixed(0)}</div>
                    </div>
                </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
                <p className="text-lg">Our OLS model reduced the error from <span className="text-red-400 font-bold">{calculateTSS.toFixed(0)}</span> down to <span className="text-green-400 font-bold">{calculateRSS.toFixed(0)}</span>!</p>
                <p className="text-sm text-slate-400 mt-2">That's a reduction of <span className="text-brand-blue font-bold">{((1 - calculateRSS / calculateTSS) * 100).toFixed(1)}%</span></p>
            </div>
        </div>
    );
};

const C5S1: React.FC = () => (
    <ChapterWrapper title="Chapter 5: Is Our Model Any Good?" subtitle="Step 1: Comparing Two Strategies">
        <p>We have the "best" line according to OLS. But is it actually any good at predicting sales?</p>
        <p>Let's compare two strategies. The red lines show errors when we ignore temperature and just guess the average. The green lines show errors when we use our OLS model.</p>
        <BaselineComparison />
        <p className="mt-4 text-center italic text-slate-400">Look at how much smaller the green errors are! But how do we turn this visual into a single score?</p>
    </ChapterWrapper>
);
const C5S2: React.FC = () => (
    <ChapterWrapper title="Chapter 5: Is Our Model Any Good?" subtitle="Step 2: Creating a Universal Score">
        <p>You saw the error reduction: from TSS (baseline) down to RSS (our model). But raw numbers aren't intuitive—is reducing error by 5,000 good? What about 50,000?</p>
        <p>We need a universal score that works for any dataset, regardless of scale.</p>
        <Quiz
            question="How could we express our model's improvement over the baseline as a single, intuitive score between 0 and 1?"
            options={[
                { text: 'The difference: TSS - RSS', isCorrect: false, feedback: "This tells us the raw amount of error we reduced, which is useful! But it's not standardized. A value of '5000' is big for small numbers but tiny for large numbers." },
                { text: 'The ratio: RSS / TSS', isCorrect: false, feedback: "This tells us what percentage of the original error is *left over* in our model. It's getting closer, but it's a bit backward—a lower score is better." },
                { text: 'The percentage of error we eliminated: (TSS - RSS) / TSS', isCorrect: true, feedback: "Exactly! This tells us what proportion of the total variation our model was able to explain. It's a clear, intuitive score between 0 and 1." }
            ]}
        />
    </ChapterWrapper>
);
const C5S3: React.FC = () => (
    <ChapterWrapper title="Chapter 5: Is Our Model Any Good?" subtitle="Step 3: R-Squared">
        <p>You've just reinvented one of the most important metrics in regression: <strong>R-squared (R<sup>2</sup>)</strong>.</p>
        <div className="text-center my-4 p-4 bg-slate-900/50 rounded-lg font-mono text-brand-blue">
            R<sup>2</sup> = (TSS - RSS) / TSS &nbsp;&nbsp; or &nbsp;&nbsp; 1 - (RSS / TSS)
        </div>
        <p>An R<sup>2</sup> of 0 means our model is no better than guessing the average. An R<sup>2</sup> of 1 means our model is perfect.</p>
        <p>If our ice cream model has an R<sup>2</sup> of 0.75, it means that temperature can explain 75% of the variation in ice cream sales. The other 25% is due to other factors (day of the week, holidays, random chance, etc.).</p>
    </ChapterWrapper>
);

// --- Chapter 6 & 7 ---
const C6S1: React.FC = () => (
    <ChapterWrapper title="Chapter 6: Beyond a Single Cause">
        <p>Our world is complex. Ice cream sales don't only depend on temperature. What about the day of the week, or if there's a local holiday?</p>
        <p>When we use more than one input variable (or "predictor") to predict an outcome, we are using <strong>Multiple Linear Regression</strong>.</p>
        <p>The equation just gets longer, with a new &beta; coefficient for each new variable:</p>
        <div className="text-center my-4 p-4 bg-slate-900/50 rounded-lg font-mono text-brand-blue">
            Y-hat = &beta;<sub>0</sub> + &beta;<sub>1</sub>X<sub>1</sub> + &beta;<sub>2</sub>X<sub>2</sub> + &hellip; + &beta;<sub>p</sub>X<sub>p</sub>
        </div>
        <p>Each coefficient (&beta;) tells us the effect of one variable while holding all others constant. This allows us to isolate the impact of individual factors, like experience or education on salary.</p>
    </ChapterWrapper>
);
const C7S1: React.FC = () => (
    <ChapterWrapper title="Chapter 7: Prediction vs. Inference">
        <p>We've built a model to make the best possible predictions. This is the primary goal of <strong>Machine Learning</strong>. We care about performance on new, unseen data. How low is our error?</p>
        <p>However, we could use the same model to understand the world. We could ask: "Is the relationship between gender and salary in our data <strong>real</strong>, or could it just be a random coincidence?". This is the focus of <strong>traditional statistics</strong>, which emphasizes inference and hypothesis testing.</p>
        <p>Both approaches use the same tools (like OLS), but they ask different questions. A data scientist needs to be comfortable with both perspectives.</p>
        <p className="mt-6 font-bold text-slate-300 text-lg">You've learned the core concepts. Now, let's test your knowledge in a final quiz!</p>
    </ChapterWrapper>
);

// --- Chapter 8: Final Quiz ---
const C8S1: React.FC = () => (
    <ChapterWrapper title="Chapter 8: Test Your Knowledge" subtitle="Question 1 of 4">
        <Quiz question="What is the primary goal of the Ordinary Least Squares (OLS) algorithm?" options={[
            {text: "To find the line that passes through the most data points.", isCorrect: false, feedback: "Not quite. A line can rarely pass through more than two points in a messy dataset. OLS tries to be close to *all* points, not pass through a few."},
            {text: "To minimize the Residual Sum of Squares (RSS).", isCorrect: true, feedback: "Exactly! OLS finds the unique line that makes the sum of the squared vertical distances from each point to the line as small as possible."},
            {text: "To minimize the sum of the absolute values of the residuals.", isCorrect: false, feedback: "This is a valid method called Least Absolute Deviations, but it's not OLS. OLS specifically minimizes the sum of the *squares*."},
        ]} />
    </ChapterWrapper>
);
const C8S2: React.FC = () => (
    <ChapterWrapper title="Chapter 8: Test Your Knowledge" subtitle="Question 2 of 4">
        <Quiz question="You build a model to predict house prices and get an R-squared value of 0.65. What does this mean?" options={[
            {text: "The model's predictions are correct 65% of the time.", isCorrect: false, feedback: "This is a common misconception. R-squared isn't about accuracy like in classification. It's about explaining variation."},
            {text: "The input variables (like square footage) explain 65% of the variation in house prices.", isCorrect: true, feedback: "Perfect! R-squared tells us the proportion of the total variance in the outcome that is explained by our model."},
            {text: "The model's error is 65% smaller than a perfect model.", isCorrect: false, feedback: "It's the other way around. It means the model's error (RSS) is 35% of the baseline model's error (TSS)."},
        ]} />
    </ChapterWrapper>
);
const C8S3: React.FC = () => (
    <ChapterWrapper title="Chapter 8: Test Your Knowledge" subtitle="Question 3 of 4">
        <Quiz question="In a multiple regression model predicting salary from 'years of experience' and 'education level', what does the coefficient for 'years of experience' tell you?" options={[
            {text: "The total increase in salary for each year of experience, regardless of education.", isCorrect: false, feedback: "Not quite. The key part of multiple regression is that it isolates the effects."},
            {text: "The predicted salary for someone with one year of experience.", isCorrect: false, feedback: "That would be related to the intercept and the coefficient combined, not just the coefficient alone."},
            {text: "The increase in salary for one extra year of experience, holding education level constant.", isCorrect: true, feedback: "Correct! Each coefficient in multiple regression represents the effect of one variable while statistically controlling for the others."},
        ]} />
    </ChapterWrapper>
);
const C8S4: React.FC = () => (
    <ChapterWrapper title="Chapter 8: Test Your Knowledge" subtitle="Question 4 of 4">
        <Quiz question="You work for an e-commerce company and need to build a system to forecast sales for the next quarter with the highest possible accuracy. Is your primary goal prediction or inference?" options={[
            {text: "Prediction: The main goal is to get the most accurate number possible.", isCorrect: true, feedback: "Exactly. When the accuracy of the outcome is the top priority, you are in the realm of prediction, the primary focus of machine learning."},
            {text: "Inference: The main goal is to understand which marketing channels drive sales.", isCorrect: false, feedback: "Understanding the 'why' behind the numbers is inference. While useful, the prompt specified that the goal was the highest possible accuracy for the forecast itself."},
            {text: "Both are equally important in this case.", isCorrect: false, feedback: "While both are often useful, the task of forecasting with maximum accuracy is squarely a prediction task."},
        ]} />
    </ChapterWrapper>
);
const C8S5: React.FC = () => (
    <ChapterWrapper title="Congratulations!">
        <p className="text-xl text-center text-green-400">You've completed The Art of Prediction!</p>
        <p>You now understand the complete workflow of a foundational supervised learning algorithm. You've seen how to:</p>
        <ul className="list-disc list-inside my-4 pl-4 space-y-2">
            <li>Define a model by finding a pattern in data.</li>
            <li>Quantify error and find the "best" line using the principle of <strong>Ordinary Least Squares</strong>.</li>
            <li>Evaluate a model's performance with <strong>R-squared</strong>.</li>
            <li>Understand the difference between <strong>prediction</strong> and <strong>inference</strong>.</li>
        </ul>
        <p>This is the foundation for much of machine learning. Well done!</p>
    </ChapterWrapper>
);


// --- Course Structure Definition ---
export const COURSE_STRUCTURE = [
    { title: "The Prediction Game", steps: [C1S1, C1S2] },
    { title: "From Perfect to Plausible", steps: [C2S1, C2S2] },
    { title: "Discovering 'The Best' Line", steps: [C3S1, C3S2, C3S3, C3S4] },
    { title: "Building the Machine", steps: [C4S1, C4S2, C4S3] },
    { title: "Is Our Model Any Good?", steps: [C5S1, C5S2, C5S3] },
    { title: "Beyond a Single Cause", steps: [C6S1] },
    { title: "Prediction vs. Inference", steps: [C7S1] },
    { title: "Test Your Knowledge", steps: [C8S1, C8S2, C8S3, C8S4, C8S5] },
];

// --- Main Exported Component ---
interface ChapterContentProps {
    chapter: number;
    step: number;
}
export const ChapterContent: React.FC<ChapterContentProps> = ({ chapter, step }) => {
  const StepComponent = COURSE_STRUCTURE[chapter]?.steps[step];
  if (!StepComponent) {
      return <div>Content not found.</div>;
  }
  return <StepComponent />;
};
