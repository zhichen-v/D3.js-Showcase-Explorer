import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: Date;
  value: number;
}

export const TimeSeriesChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 40, right: 30, bottom: 40, left: 50 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const data: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1),
      value: 20 + Math.random() * 60 + Math.sin(i / 3) * 15
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Area generator
    const area = d3.area<DataPoint>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => x(d.date))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f97316")
      .attr("stop-opacity", 0.3);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f97316")
      .attr("stop-opacity", 0);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d") as any))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line").attr("stroke", "#e5e7eb");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line").attr("stroke", "#e5e7eb");

    // Draw area
    const areaPath = g.append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    // Draw line
    const linePath = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f97316")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Animation
    const totalLength = linePath.node()?.getTotalLength() || 0;
    
    linePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    areaPath
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay(1500)
      .attr("opacity", 1);

    // Points
    g.selectAll<SVGCircleElement, DataPoint>(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d: DataPoint) => x(d.date))
      .attr("cy", (d: DataPoint) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#fff")
      .attr("stroke", "#f97316")
      .attr("stroke-width", 2)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .delay((_, i) => 1500 + (i * 30))
      .attr("opacity", 1);

  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
