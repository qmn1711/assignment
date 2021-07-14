import { ReactNode, MouseEvent, CSSProperties } from 'react';

// type SortOrder = 'asc' | 'desc' | '' | undefined; // TODO
export type SortOrder = string | undefined;

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
  sorting?: boolean;
  filtering?: (props: FilteringProps) => ReactNode;
  render?: (props: any) => ReactNode;
}

export interface TableColumn<T> extends Column<T> {
  sortOrder?: SortOrder;
  filterValue?: string | undefined;
}
export interface Sort {
  accessor: string;
  sortOrder: SortOrder;
}

export interface Filter {
  accessor: string;
  filterValue: string;
}
export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  sorts: Sort[];
  filters: Filter[];
}

export interface ReturnTable {
  headers: TableHeader[];
  rows: TableRow[];
  sorts: Sort[];
  filters: Filter[];
}
