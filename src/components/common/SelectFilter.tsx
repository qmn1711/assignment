import { FilteringProps } from '../../hooks/useTable.type'

interface SelectFilterProps<T> extends FilteringProps {
  data: T[]
  className?: string
}
export default function SelectFilter<T extends { value: string; text: string }>({
  data,
  filterValue,
  setFilter,
  className,
}: SelectFilterProps<T>) {
  const changeHandler = ({ target: { value } }: any) => setFilter(value)

  return (
    <select className={`${className} no-focusborder`} value={filterValue} onChange={changeHandler}>
      {data.map(({ value, text }: T, i: number) => (
        <option key={i} value={value}>
          {text}
        </option>
      ))}
    </select>
  )
}
