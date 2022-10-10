import React, { FC, useState, useEffect } from 'react';
import ReactExport, { ExcelSheet } from 'react-data-export';
import moment from 'moment';
import './styles.scss';
import { DownloadIcon } from '../shared';

const { ExcelFile } = ReactExport;

interface IOwnProps {
  dataLine: any;
}

const ExportBudgetTable: FC<IOwnProps> = ({ dataLine }) => {
  const [data, setData] = useState<any>([]);

  const getStyle = (dat: any, id: number) => {
    let style = {};
    style = {
      ...style,
      font: { sz: '12', color: { rgb: 'FF011E4C' } },
      alignment: {
        vertical: 'center',
        horizontal: 'center',
      },
    };
    if (dat?.name === 'Profit' || dat?.name === 'Total expenses') {
      style = {
        ...style,
        font: { sz: '14', bold: true, color: { rgb: 'FF011E4C' } },
      };
      if (id === 1) {
        style = {
          ...style,
          fill: { patternType: 'solid', fgColor: { rgb: 'FFF5F6FA' } },
          alignment: { horizontal: 'left' },
        };
      }
    }
    if (
      dat?.name === 'Harvest' ||
      dat?.name === 'Income' ||
      dat?.name === 'Expenses'
    ) {
      style = {
        ...style,
        font: { sz: '14', bold: true, color: { rgb: 'FF011E4C' } },
        alignment: { horizontal: 'left' },
      };
    }
    if (dat?.name === 'Seeding cost' || dat?.name === 'Maintenance cost') {
      style = {
        ...style,
        font: { sz: '12', bold: true, color: { rgb: 'FF011E4C' } },
      };
    }
    if (dat?.isBg && id === 1) {
      style = {
        ...style,
        fill: { patternType: 'solid', fgColor: { rgb: 'FFFAFAFA' } },
      };
    }

    if (id === 5 && dat.var) {
      const negative = !dat.var.isGrow;
      const reverse = dat.var.isReverse && dat.var.isReverse;
      const isNull = dat.var.interest === 0;
      let color = 'FF29B51C';
      if (negative) {
        color = 'FFF0142F';
        if (reverse) {
          color = 'FF29B51C';
        }
      } else if (reverse) {
        color = 'FFF0142F';
      }
      if (isNull) {
        color = 'FF07689F';
      }
      style = { ...style, font: { color: { rgb: color } } };
    }
    return style;
  };

  useEffect(() => {
    const rowData =
      dataLine &&
      dataLine.map((dat: any) => {
        let icon = '↑';
        if (dat.var) {
          const negative = !dat.var.isGrow;
          if (negative) {
            icon = '↓';
          }
        }
        return [
          { value: dat.name, style: getStyle(dat, 1) },
          {
            value: dat.budgeted !== undefined ? dat.budgeted : ' ',
            style: dat.budgeted !== undefined && getStyle(dat, 2),
          },
          {
            value: dat.actual !== undefined ? dat.actual : ' ',
            style: dat.actual !== undefined && getStyle(dat, 3),
          },
          {
            value: dat.expense_date
              ? moment.unix(dat.expense_date / 1000).format('YYYY.MM.DD')
              : ' ',
            style: dat.expense_date && getStyle(dat, 4),
          },
          {
            value: dat.var ? `${icon} ${dat.var.interest}%` : ' ',
            style: dat.var && getStyle(dat, 5),
          },
        ];
      });
    const header = [
      { title: '', width: { wpx: 150 } },
      { title: 'Budgeted', width: { wpx: 150 } },
      { title: 'Actual', width: { wpx: 150 } },
      { title: 'Date', width: { wpx: 150 } },
      { title: 'Var, %', width: { wpx: 150 } },
    ];
    setData([
      {
        columns: header,
        data: rowData === undefined ? rowData : [],
      },
    ]);
  }, [dataLine]);

  return (
    <ExcelFile
      element={
        <button
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          <DownloadIcon />
        </button>
      }
      filename='Budget'
    >
      <ExcelSheet name='Budget' dataSet={data} />
    </ExcelFile>
  );
};

export default ExportBudgetTable;
