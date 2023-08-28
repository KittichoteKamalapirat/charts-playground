import clsx from "clsx";
import { curveCardinal, line, select } from "d3";
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
    const myLine = line<AudioPitch>()
      .x((value) => value.seconds * 200)
      .y((value) => 150 - value.frequency)
      .curve(curveCardinal);

    svg
      .selectAll("path")
      .data([data])
      .join("path")
      .attr("d", (value) => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [data]);
  return (
    <div className={clsx(className)}>
      {/* <svg ref={svgRef}>
        <path d="M0,150 100,100 150,120" stroke="blue" fill="none" />
      </svg> */}
      <svg ref={svgRef} />
    </div>
  );
};
export default Chart;
