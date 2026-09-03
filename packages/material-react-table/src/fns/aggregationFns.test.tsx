import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { MaterialReactTable } from '../components/MaterialReactTable';
import { type MRT_ColumnDef } from '../types';

interface Sale {
  amount: number;
  region: string;
}

const data: Sale[] = [
  { amount: 10, region: 'North' },
  { amount: 30, region: 'North' },
  { amount: 100, region: 'South' },
];

const columns = (aggregationFn: string): MRT_ColumnDef<Sale>[] => [
  { accessorKey: 'region', header: 'Region' },
  {
    accessorKey: 'amount',
    AggregatedCell: ({ cell }) => <span>agg:{String(cell.getValue())}</span>,
    aggregationFn,
    header: 'Amount',
  },
];

const renderGrouped = (aggregationFn: string) =>
  render(
    <MaterialReactTable
      columns={columns(aggregationFn)}
      data={data}
      enableExpanding
      enableGrouping
      initialState={{ expanded: true, grouping: ['region'] }}
    />,
  ).container;

describe('aggregation fns', () => {
  test.each([
    ['sum', ['agg:40', 'agg:100']],
    ['max', ['agg:30', 'agg:100']],
    ['min', ['agg:10', 'agg:100']],
    ['mean', ['agg:20', 'agg:100']],
    ['count', ['agg:2', 'agg:1']],
  ])('%s aggregates each group', (aggregationFn, expected) => {
    const container = renderGrouped(aggregationFn);

    const aggregated = Array.from(
      container.querySelectorAll('tbody td'),
    )
      .map((td) => td.textContent)
      .filter((text) => text?.startsWith('agg:'));

    expect(aggregated).toEqual(expected);
  });
});
