import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import {
  csv,
  max,
  min,
  sum,
  histogram as bin,
  extent,
  format,
  timeFormat,
  scaleBand,
  scaleLinear,
  scaleTime,
  timeMonths,
} from 'd3';
import { useData } from './useData.js';
import { AxisBottom } from './axisBottom.js';
import { AxisLeft } from './axisLeft.js';
import { Marks } from './marks.js';

const width = 960;
const height = 500;

const margin = {
  top: 20,
  bottom: 80,
  left: 100,
  right: 20,
};

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const centerX = width / 2;
const centerY = height / 2;

export const App = () => {
  const data = useData();
  if (!data) {
    return (
      <pre id="message-container">Data is loading</pre>
    );
  }

  const xValue = (d) => d['Reported Date'];
  const yValue = (d) => d['Total Dead and Missing'];
  
  const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const timeStart = min(xScale.domain());
  const timeStop = max(xScale.domain());
  const binnedData = bin()
    .value(xValue)
    .domain(xScale.domain())
    .thresholds(timeMonths(timeStart, timeStop))(data)
    .map((array) => ({
      y: sum(array, yValue),
      x0: array.x0,
      x1: array.x1,
    }));

  const yScale = scaleLinear()
    .domain([0, max(binnedData, (d) => d.y)])
    .range([innerHeight, 0])
    .nice();

  const xAxisLabel = 'Time';
  const yAxisLabel = 'Total Dead and Missing';

  const tickFormat = timeFormat('%b-%y');

  const tooltipFormat = timeFormat('%b-%y');

  const barPadding =
    (innerHeight * 0.1) / binnedData.length;

  return (
    <svg width={width} height={height} className="gfx">
      <g
        transform={`translate(${margin.left}, ${margin.top})`}
      >
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={tickFormat}
          tickOffset={5}
        />
        <text
          className="axisLabel"
          y={innerHeight / 2}
          textAnchor="middle"
          font-size="28"
          transform={`translate(${-255}, ${innerHeight / 2})
          rotate(-90)`}
        >
          {yAxisLabel}
        </text>
        <AxisLeft yScale={yScale} innerWidth={innerWidth} />
        <text
          className="axisLabel"
          x={innerWidth / 2}
          y={innerHeight + 50}
          textAnchor="middle"
          font-size="28"
        >
          {xAxisLabel}
        </text>
        <Marks
          binnedData={binnedData}
          xScale={xScale}
          yScale={yScale}
          barPadding={barPadding}
          tooltipFormat={tooltipFormat}
          innerHeight={innerHeight}
        />
      </g>
    </svg>
  );
};
