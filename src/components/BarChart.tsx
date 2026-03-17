import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RefreshCw } from 'lucide-react';

interface DataItem {
  name: string;
  value: number;
}

export const AnimatedBarChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<DataItem[]>(generateData());

  function generateData() {
    const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return categories.map(name => ({
      name,
      value: Math.floor(Math.random() * 80) + 20
    }));
  }

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 40, right: 30, bottom: 40, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line")
      .attr("stroke", "#e5e7eb");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line")
      .attr("stroke", "#e5e7eb");

    // Bars
    const bars = g.selectAll<SVGRectElement, DataItem>(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: DataItem) => x(d.name) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", "#f97316");

    // Animation
    bars.transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr("y", (d: DataItem) => y(d.value))
      .attr("height", (d: DataItem) => height - y(d.value));

    // Values on top
    g.selectAll<SVGTextElement, DataItem>(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label font-mono text-[10px] font-bold")
      .attr("x", (d: DataItem) => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", (d: DataItem) => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#18181b")
      .text((d: DataItem) => d.value)
      .attr("opacity", 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 50 + 400)
      .attr("opacity", 1);

  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={() => setData(generateData())}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold transition-colors"
        >
          <RefreshCw size={14} /> Update Data
        </button>
      </div>
      <div className="chart-container">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
};
