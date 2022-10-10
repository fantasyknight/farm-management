import React, { FC, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
// import * as d4 from 'd3'

import randomKey from '../../util/randomKey';
import { Paragrapgh, Subtitle } from '../shared';
import { useWidth } from '../../util/useWidth';

import './styles.scss';

interface IOwnProps {
  width: number;
  data: any[];
}

const Chart: FC<IOwnProps> = ({ width, data }) => {
  const windowWidth = useWidth();
  const chartWrapRef = useRef<any>();

  const handleOnMouseout = () => {
    d3.select('.mouse-line').style('opacity', '0');
    d3.select('.tooltipCart').style('display', 'none');
    d3.selectAll('.mouse-per-line circle').style('opacity', '0');
    d3.selectAll('.mouse-per-line text').style('opacity', '0');
  };

  const addTooltip = () => {
    d3.select('.tooltipCart').remove();
    const tooltip = d3
      .select('#chart')
      // .select('.mouse-over-effects')
      .append('g')
      .attr('class', 'tooltipCart')
      .style('display', 'none');

    const text = tooltip.append('text');

    text.append('p').attr('class', 'title').text('Seeding');
    text.append('div').attr('class', 'info');
    text.append('p').attr('class', 'date').text('Dec, 2020');

    return tooltip;
  };

  const renderMultiChart = () => {
    const height = width === 800 ? 200 : 310;
    const margin = 50;
    /* Format Data */
    const parseDate = d3.timeParse('%Y%m%d');
    data.forEach((item: any) => {
      item.values.forEach((d: any) => {
        // eslint-disable-next-line no-param-reassign
        if (typeof d.date === 'number') d.date = parseDate(d.date);
        // eslint-disable-next-line no-param-reassign
        d.count = +d.count;
      });
    });

    /* Max data velues */
    const maxDataVelues: any = [];
    data.forEach((item: any) => {
      maxDataVelues.push(d3.max(item.values, (d: any) => +d.count));
    });

    const maxValue: any[] = d3.extent(data[2].values, (d: any) => d.date);
    const maxDate = maxValue[1].toString().replace('Dec 01', 'Dec 10');

    /* Scale */
    const xScale = d3
      .scaleTime()
      .domain([maxValue[0], new Date(maxDate)])
      .range([0, width - margin]);

    const maxYValue: any = d3.max(maxDataVelues);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxYValue < 10 ? 10 : maxYValue])
      .range([height - margin, 0]);

    /* Add SVG */
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', `${width}px`)
      .attr('height', `${height + margin}px`)
      .attr('class', `svg`)
      .append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    /* Add Axis into SVG */
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(14)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .tickFormat(d3.timeFormat('%b'));
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(xAxis);

    svg.append('g').attr('class', 'y axis').call(yAxis);

    d3.select('.x').selectAll('.tick').select('text').attr('y', 20);
    d3.select('.y').selectAll('.tick').select('text').attr('x', -24);

    /* Add line into SVG */
    const line = d3
      .line()
      .x((d: any) => xScale(d.date))
      .y((d: any) => yScale(d.count))
      .curve(d3.curveCardinal.tension(0.85));

    const lines = svg.append('g').attr('class', 'lines');

    lines
      .selectAll('.line-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', (d: any) => `line ${d.name}`)
      .attr('d', (d: any) => line(d.values));

    d3.select('.x').selectAll('g').select('line').attr('y2', '0');
    d3.select('.y').selectAll('g').select('line').attr('x2', width);

    const mouseG = svg.append('g').attr('class', 'mouse-over-effects');

    mouseG
      .append('path') // this is the black vertical line to follow mouse
      .attr('class', 'mouse-line')
      .style('opacity', '0');

    const mousePerLine = mouseG
      .selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line');

    mousePerLine.append('circle').attr('r', 6).style('opacity', '0');

    mousePerLine.append('text').style('transform', 'translate(10,3)');
    addTooltip();

    mouseG
      .append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', () => handleOnMouseout())
      .on('mouseover', () => {
        d3.select('.tooltipCart').style('display', 'block');
        d3.select('.mouse-line').style('opacity', '1');
        d3.selectAll('.mouse-per-line circle')
          .attr('class', (d: any) => `circle ${d.name}`)
          .style('opacity', '1');
        d3.selectAll('.mouse-per-line text').style('opacity', '1');
      })
      .on('mousemove', event => {
        const mouseValue: any = d3.pointer(event);
        let selectedValue: any = {};
        const scroll: number = chartWrapRef.current.scrollLeft;

        d3.selectAll('.mouse-per-line').style('opacity', (d: any, i: any) => {
          const xDate = xScale.invert(mouseValue[0]);
          const bisect = d3.bisector(function (item: any) {
            return item.date;
          }).right;

          const index = bisect(d.values, xDate);
          const mouseXValue: any = xScale.invert(mouseValue[0]);
          const mouseYValue: any = yScale.invert(mouseValue[1]);
          const d0 = d.values[index - 1];
          const d1 = d.values[index];

          const thisDate =
            mouseXValue - d0?.date < d1?.date - mouseXValue ? d0 : d1;

          if (
            !selectedValue?.index ||
            Math.abs(mouseYValue - selectedValue.data?.count) >
              Math.abs(mouseYValue - thisDate?.count)
          ) {
            selectedValue = {
              index,
              data: thisDate !== undefined ? thisDate : d0,
              name: d.name,
            };
          }
          return `0`;
        });
        const y = yScale(selectedValue?.data?.count);
        const x = xScale(selectedValue?.data?.date);

        d3.select('.tooltipCart').style(
          'transform',
          `translate(${x - 45 - scroll}px,${
            height === 200 ? y - 340 : y - 450
          }px)`,
        );

        d3.select('.mouse-line').attr('d', () => {
          let dPath = `M${x},${height - 50}`;
          dPath += ` ${x},${y}`;
          return dPath;
        });

        d3.select('.mouse-per-line')
          .attr('transform', `translate(${x},${y})`)
          .style('opacity', '1');

        d3.select('.tooltipCart').selectAll('.item').remove();

        d3.select('.tooltipCart')
          .select('.title')
          .text(
            selectedValue.name === 'harvest' ? 'harvests' : selectedValue.name,
          );
        const thisDate = new Date(selectedValue?.data?.date).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'short',
          },
        );

        selectedValue?.data?.information?.forEach((info: any) => {
          d3.select('.tooltipCart')
            .select('.info')
            .append('p')
            .attr('class', 'item')
            .text(info);
        });

        d3.select('.tooltipCart')
          .select('.date')
          .text(thisDate.replace(' ', ', '));
      });
  };

  useEffect(() => {
    // const data: any = [
    //   {
    //     name: 'harvest',
    //     values: [
    //       {
    //         date: '202001',
    //         count: '100',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202002',
    //         count: '110',
    //         information: ['Farm 3 - Lines 1,2,3', 'Farm 5 - Lines 1,2'],
    //       },
    //       {
    //         date: '202003',
    //         count: '145',
    //         information: ['Farm 1 - Lines 1', 'Farm 2 - Lines 5,2'],
    //       },
    //       {
    //         date: '202004',
    //         count: '241',
    //         information: ['Farm 8 - Lines 4', 'Farm 9 - Lines 5'],
    //       },
    //     ],
    //   },
    //   {
    //     name: 'seedings',
    //     values: [
    //       {
    //         date: '202001',
    //         count: '200',
    //         information: ['Farm 1 - Lines 1,5,3', 'Farm 2 - Lines 1,6'],
    //       },
    //       {
    //         date: '202002',
    //         count: '120',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202003',
    //         count: '33',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202004',
    //         count: '21',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //     ],
    //   },
    //   {
    //     name: 'assessments',
    //     values: [
    //       {
    //         date: '202001',
    //         count: '50',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202002',
    //         count: '10',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202003',
    //         count: '5',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //       {
    //         date: '202004',
    //         count: '71',
    //         information: ['Farm 1 - Lines 1,2,3', 'Farm 2 - Lines 1,2'],
    //       },
    //     ],
    //   },
    // ];

    if (width > 200) {
      d3.select('.tooltip').remove();
      d3.select('#chart').select('svg').remove();
      renderMultiChart();
    }
  }, [width]);

  const types = [
    { name: 'Harvest', value: 'harvest' },
    { name: 'Seeding', value: 'seeding' },
    { name: 'Assessment', value: 'assessment' },
  ];

  return (
    <div className='chart-card'>
      <div className='d-flex justify-content-between align-items-center'>
        <Subtitle size={1} color='black-3' align='left' fontWeight={500}>
          Statistics
        </Subtitle>
        {windowWidth > 800 && (
          <div className='chart-card__labels'>
            {types.map(item => {
              const key = randomKey();
              return (
                <div key={key} className='d-flex align-items-center'>
                  <span
                    className={`chart-card__line chart-card__line--${item.value}`}
                  />
                  <Paragrapgh
                    className='ml-12'
                    size={2}
                    color='black-2'
                    align='left'
                    fontWeight={500}
                  >
                    {item.name}
                  </Paragrapgh>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div id='chart' ref={chartWrapRef} />
      {windowWidth <= 800 && (
        <div className='chart-card__labels'>
          {types.map(item => {
            const key = randomKey();
            return (
              <div key={key} className='d-flex align-items-center'>
                <span
                  className={`chart-card__line chart-card__line--${item.value}`}
                />
                <Paragrapgh
                  className='ml-12'
                  size={2}
                  color='black-2'
                  align='left'
                  fontWeight={500}
                >
                  {item.name}
                </Paragrapgh>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chart;
