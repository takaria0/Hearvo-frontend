import React from "react";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

export const MyResponsivePie = ({ data, colors, legends }: any) => (
  <ResponsivePie
    data={data}
    margin={{ top: 20, right: -50, bottom: 40, left: 30 }}
    innerRadius={0}
    padAngle={0}
    cornerRadius={0}
    // colors={{ scheme: 'set1' }}
    colors={colors}
    borderWidth={1}
    // borderColor={{ from: 'color', modifiers: [['darker', 3]] }}
    borderColor="black"
    radialLabelsSkipAngle={10}
    enableRadialLabels={false}
    radialLabelsTextColor="#33333"
    radialLabelsLinkColor={{ from: "color" }}
    sortByValue={true}
    sliceLabelsSkipAngle={10}
    sliceLabelsTextColor="#33333"
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "ruby",
        },
        id: "dots",
      },
      {
        match: {
          id: "c",
        },
        id: "dots",
      },
      {
        match: {
          id: "go",
        },
        id: "dots",
      },
      {
        match: {
          id: "python",
        },
        id: "dots",
      },
      {
        match: {
          id: "scala",
        },
        id: "lines",
      },
      {
        match: {
          id: "lisp",
        },
        id: "lines",
      },
      {
        match: {
          id: "elixir",
        },
        id: "lines",
      },
      {
        match: {
          id: "javascript",
        },
        id: "lines",
      },
    ]}
    legends={legends}
  />
);

export const MyResponsiveBar = ({
  data,
  keys,
  margin /* see data tab */,
}: any) => (
  <ResponsiveBar
    data={data}
    keys={keys}
    indexBy="content"
    margin={margin}
    padding={0}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "set3" }}
    enableGridY={false}
    layout={"horizontal"}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#38bcb2",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "#eed312",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    // fill={[
    //   {
    //     match: {
    //       id: 'fries'
    //     },
    //     id: 'dots'
    //   },
    //   {
    //     match: {
    //       id: 'sandwich'
    //     },
    //     id: 'lines'
    //   }
    // ]}
    borderColor={{ from: "color", modifiers: [["darker", 3]] }}
    borderWidth={1}
    axisTop={null}
    axisRight={null}
    axisBottom={null}
    // axisBottom={{
    //   tickSize: 5,
    //   tickPadding: 5,
    //   tickRotation: 0,
    //   legend: 'country',
    //   legendPosition: 'middle',
    //   legendOffset: 32
    // }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 30,
      // legend: 'food',
      // legendPosition: 'middle',
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{ from: "color", modifiers: [["darker", 3]] }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "top-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "right-to-left",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
);
