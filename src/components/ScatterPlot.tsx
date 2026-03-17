import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Point {
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
}

export const InteractiveScatterPlot: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = containerRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const data: Point[] = Array.from({ length: 50 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 15 + 5,
      color: d3.interpolateViridis(Math.random()),
      label: `Point ${i + 1}`
    }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid text-zinc-100")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickFormat(() => ""));

    g.append("g")
      .attr("class", "grid text-zinc-100")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""));

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line").attr("stroke", "#e5e7eb");

    g.append("g")
      .call(d3.axisLeft(y))
      .attr("class", "text-zinc-400 font-mono text-[10px]")
      .selectAll("path, line").attr("stroke", "#e5e7eb");

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "d3-tooltip");

    // Circles
    const circles = g.selectAll<SVGCircleElement, Point>("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d: Point) => x(d.x))
      .attr("cy", (d: Point) => y(d.y))
      .attr("r", 0)
      .attr("fill", (d: Point) => d.color)
      .attr("fill-opacity", 0.6)
      .attr("stroke", (d: Point) => d.color)
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    circles.transition()
      .duration(1000)
      .delay((_, i) => i * 10)
      .attr("r", (d: Point) => d.r);

    circles
      .on("mouseover", (event, d: Point) => {
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr("fill-opacity", 1)
          .attr("r", d.r + 5);
        
        tooltip.style("display", "block")
          .html(`
            <div class="font-bold">${d.label}</div>
            <div class="text-zinc-500">X: ${d.x.toFixed(1)}</div>
            <div class="text-zinc-500">Y: ${d.y.toFixed(1)}</div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", (event, d: Point) => {
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr("fill-opacity", 0.6)
          .attr("r", d.r);
        
        tooltip.style("display", "none");
      });

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    // svg.call(zoom); // Optional: enable zoom

    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="chart-container">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
