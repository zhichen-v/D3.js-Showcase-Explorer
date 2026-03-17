import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

export const ForceDirectedGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 400;

    const nodes: Node[] = [
      { id: "D3", group: 1 },
      { id: "Data", group: 2 },
      { id: "DOM", group: 2 },
      { id: "SVG", group: 2 },
      { id: "Canvas", group: 2 },
      { id: "Scale", group: 3 },
      { id: "Axis", group: 3 },
      { id: "Shape", group: 3 },
      { id: "Transition", group: 4 },
      { id: "Interpolation", group: 4 },
      { id: "Selection", group: 5 },
      { id: "Binding", group: 5 },
    ];

    const links: Link[] = [
      { source: "D3", target: "Data", value: 5 },
      { source: "D3", target: "DOM", value: 5 },
      { source: "D3", target: "SVG", value: 5 },
      { source: "D3", target: "Canvas", value: 2 },
      { source: "Data", target: "Binding", value: 3 },
      { source: "DOM", target: "Selection", value: 3 },
      { source: "SVG", target: "Shape", value: 3 },
      { source: "Shape", target: "Scale", value: 2 },
      { source: "Shape", target: "Axis", value: 2 },
      { source: "Transition", target: "Interpolation", value: 4 },
      { source: "D3", target: "Transition", value: 4 },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = g.append("g")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.6)
      .selectAll<SVGLineElement, Link>("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 12)
      .attr("fill", d => d3.schemeCategory10[d.group % 10])
      .call(drag(simulation) as any);

    const label = g.append("g")
      .selectAll<SVGTextElement, Node>("text")
      .data(nodes)
      .join("text")
      .text(d => d.id)
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "#71717a");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      label
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

    function drag(sim: d3.Simulation<Node, undefined>) {
      function dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
        if (!event.active) sim.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => simulation.stop();
  }, []);

  return (
    <div ref={containerRef} className="chart-container cursor-grab active:cursor-grabbing">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
