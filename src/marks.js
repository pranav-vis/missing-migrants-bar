import { line, curveNatural } from 'd3';
export const Marks = ({
  binnedData,
  xScale,
  yScale,
  barPadding,
  tooltipFormat,
  innerHeight,
}) => (
  <>
    <g className="mark">
      {binnedData.map((d) => (
        <rect
          fill="#684664"
          x={xScale(d.x0)}
          y={yScale(d.y)}
          width={xScale(d.x1) - xScale(d.x0) - barPadding}
          height={innerHeight - yScale(d.y)}
        >
          <title>
            {tooltipFormat(d.x0)}
            {' ->#'}
            {d.y}
          </title>
        </rect>
      ))}
    </g>
  </>
);
