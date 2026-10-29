import { useMaterialReactTable } from '../hooks/useMaterialReactTable';
import { type MRT_RowData, type MRT_TableInstance, type MRT_TableOptions, type Xor } from '../types';
import { MRT_TablePaper } from './table/MRT_TablePaper';

export type MaterialReactTableProps<TData extends MRT_RowData> = Xor<TableInstanceProp<TData>, MRT_TableOptions<TData>>;

type TableInstanceProp<TData extends MRT_RowData> = {
  table: MRT_TableInstance<TData>;
};

const isTableInstanceProp = <TData extends MRT_RowData>(
  props: MaterialReactTableProps<TData>,
): props is TableInstanceProp<TData> => (props as TableInstanceProp<TData>).table !== undefined;

interface MRT_TableFromOptionsProps<TData extends MRT_RowData> {
  tableOptions: MRT_TableOptions<TData>;
}

const MRT_TableFromOptions = <TData extends MRT_RowData>({
  tableOptions,
}: Readonly<MRT_TableFromOptionsProps<TData>>): JSX.Element => {
  const table = useMaterialReactTable(tableOptions);

  return <MRT_TablePaper table={table} />;
};

export const MaterialReactTable = <TData extends MRT_RowData>(props: MaterialReactTableProps<TData>): JSX.Element =>
  isTableInstanceProp(props) ? <MRT_TablePaper table={props.table} /> : <MRT_TableFromOptions tableOptions={props} />;
