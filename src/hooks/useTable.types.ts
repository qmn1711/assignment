import { ReactNode, MouseEvent, CSSProperties } from 'react';

export type SortOrder = 'asc' | 'desc' | undefined;

export type SetFilter = (value: string) => void;

export interface FilteringProps {
  filterValue: string | undefined;
  setFilter: SetFilter;
}

export interface TableHeaderProps {
  onClick: (e: MouseEvent) => void;
  style: CSSProperties;
}
export interface TableHeader {
  getHeaderProps: () => TableHeaderProps;
  getClassName: (value: string) => string;
  render: () => ReactNode;
  sortOrder: SortOrder;
  // getSortOrder: () => SortOrder;
  filterValue: string | undefined;
  setFilter: SetFilter;
  renderFilter: (() => ReactNode) | undefined;
}

export interface TableCell {
  getCellProps: () => void;
  getClassName: (value: string) => string;
  render: () => ReactNode;
}
export interface TableRow {
  cells: TableCell[];
}

export interface Column<T> {
  header: string;
  accessor: string;
  sort?: SortOrder | boolean;
  filter?: (props: FilteringProps) => ReactNode;
  filterValue?: string | undefined;
  render?: (props: any) => ReactNode;
}

export interface TableColumn<T> extends Column<T> {
  sortOrder?: SortOrder;
  // filterValue?: string | undefined;
}
export interface Sort {
  accessor: string;
  sort: SortOrder;
}

export interface Filter {
  accessor: string;
  filterValue: string;
}

export interface TableQuery {
  sorts?: Sort[];
  filters?: Filter[];
}
export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
}

export interface ReturnTable {
  headers: TableHeader[];
  rows: TableRow[];
  sorts: Sort[];
  filters: Filter[];
}
