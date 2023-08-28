import clsx from "clsx";
import {
  axisBottom,
  axisLeft,
  curveCardinal,
  line,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef } from "react";

export interface AudioPitch {
  frequency: number;
  seconds: number;
}

export interface APIAudioPitch {
  pitch: number;
  timestamp: number;
}

interface Props {
  data: AudioPitch[];
  className?: string;
}

const Chart = ({ data, className }: Props) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    // adding axis
    const maxX = Math.max(...data.map((val) => val.seconds));
    const minX = Math.min(...data.map((val) => val.seconds));

    const maxY = Math.max(...data.map((val) => val.frequency));
    const minY = Math.min(...data.map((val) => val.frequency));

    const svgWidth = 600; // have to match css
    const svgHeight = 300;

    const xScale = scaleLinear().domain([0, maxX]).range([0, svgWidth]);

    const yScale = scaleLinear().domain([0, maxY]).range([svgHeight, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${svgHeight}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${svgWidth}px)`)
      .call(yAxis);

    const myLine = line<AudioPitch>()
      .x((value) => xScale(value.seconds))
      .y((value) => yScale(value.frequency))
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [data]);
  return (
    <div className={clsx(className)}>
      {/* <svg ref={svgRef}>
        <path d="M0,150 100,100 150,120" stroke="blue" fill="none" />
      </svg> */}
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
export default Chart;
