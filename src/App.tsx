/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Share2, 
  Activity, 
  MousePointer2, 
  Code2, 
  ChevronRight,
  Info,
  ExternalLink,
  Github
} from 'lucide-react';
import * as d3 from 'd3';

// Visualization Components (to be implemented)
import { AnimatedBarChart } from './components/BarChart';
import { InteractiveScatterPlot } from './components/ScatterPlot';
import { ForceDirectedGraph } from './components/ForceGraph';
import { TimeSeriesChart } from './components/LineChart';

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Introduction', icon: Info },
    { id: 'bars', title: 'Dynamic Bars', icon: BarChart3 },
    { id: 'scatter', title: 'Interactive Scatter', icon: MousePointer2 },
    { id: 'force', title: 'Force Networks', icon: Share2 },
    { id: 'line', title: 'Time Series', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 p-6 flex flex-col gap-8 sticky top-0 h-auto lg:h-screen z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
            D3
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Showcase</h1>
            <p className="text-xs text-zinc-500 font-mono">v7.9.0</p>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">Navigation</p>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === section.id 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <section.icon size={18} className={activeSection === section.id ? 'text-orange-400' : 'text-zinc-400 group-hover:text-zinc-900'} />
              <span className="font-medium text-sm">{section.title}</span>
              {activeSection === section.id && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight size={14} className="text-zinc-500" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-zinc-100">
          <a 
            href="https://d3js.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ExternalLink size={14} />
            Official Documentation
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-50/50">
        <div className="max-w-5xl mx-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            {activeSection === 'intro' && (
              <motion.section
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider">
                    Data-Driven Documents
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-zinc-900 leading-[0.9]">
                    The Power of <br />
                    <span className="text-orange-500 italic serif">Visualization.</span>
                  </h2>
                  <p className="text-xl text-zinc-600 max-w-2xl leading-relaxed">
                    D3.js is a JavaScript library for manipulating documents based on data. 
                    It helps you bring data to life using HTML, SVG, and CSS.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <Code2 size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Data Binding</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      Bind arbitrary data to a Document Object Model (DOM), and then apply data-driven transformations to the document.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Activity size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Transitions</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      D3's focus on transformation extends naturally to animated transitions, making it easy to see how data changes over time.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-[2rem] p-8 lg:p-12 text-white overflow-hidden relative">
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-3xl font-bold tracking-tight">Why D3?</h3>
                    <ul className="space-y-4 text-zinc-400">
                      <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span><strong className="text-white">Web Standards:</strong> Works directly with SVG, HTML5, and CSS.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span><strong className="text-white">Efficiency:</strong> Minimal overhead, supporting large datasets and dynamic behaviors.</span>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span><strong className="text-white">Flexibility:</strong> No pre-defined chart types. You build exactly what you need.</span>
                      </li>
                    </ul>
                    <button 
                      onClick={() => setActiveSection('bars')}
                      className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all"
                    >
                      Explore Examples <ChevronRight size={18} />
                    </button>
                  </div>
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full -mr-20 -mt-20" />
                </div>
              </motion.section>
            )}

            {activeSection === 'bars' && (
              <motion.section
                key="bars"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Dynamic Bar Chart</h2>
                  <p className="text-zinc-500">Demonstrating data binding, scales, and animated transitions.</p>
                </div>
                <AnimatedBarChart />
                <div className="prose prose-zinc max-w-none">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    This example shows how D3 handles enter, update, and exit patterns. 
                    When the data changes, D3 calculates the difference and animates the bars to their new positions and sizes.
                  </p>
                </div>
              </motion.section>
            )}

            {activeSection === 'scatter' && (
              <motion.section
                key="scatter"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Interactive Scatter Plot</h2>
                  <p className="text-zinc-500">Exploring tooltips, zooming, and multi-dimensional data.</p>
                </div>
                <InteractiveScatterPlot />
                <div className="prose prose-zinc max-w-none">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Scatter plots are excellent for showing correlations. This implementation includes 
                    interactive tooltips and a zoom behavior that allows for deep exploration of dense data points.
                  </p>
                </div>
              </motion.section>
            )}

            {activeSection === 'force' && (
              <motion.section
                key="force"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Force-Directed Graph</h2>
                  <p className="text-zinc-500">Visualizing relationships and network topologies using physics simulations.</p>
                </div>
                <ForceDirectedGraph />
                <div className="prose prose-zinc max-w-none">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    D3's force simulation uses a velocity Verlet integrator for physical forces. 
                    Nodes repel each other while links pull them together, creating an organic layout of complex networks.
                  </p>
                </div>
              </motion.section>
            )}

            {activeSection === 'line' && (
              <motion.section
                key="line"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold tracking-tight">Time Series Analysis</h2>
                  <p className="text-zinc-500">Rendering smooth area charts with complex path generators.</p>
                </div>
                <TimeSeriesChart />
                <div className="prose prose-zinc max-w-none">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Line and area charts are the bread and butter of data visualization. 
                    D3 provides powerful path generators and curve interpolators to create smooth, professional charts.
                  </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
