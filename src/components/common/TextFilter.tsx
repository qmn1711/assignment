import { FilteringProps } from '../../hooks/useTable.type'

import './TextFilter.scss'

function TextFilter({ filterValue, setFilter }: FilteringProps) {
  const clickHandler = (e: any) => {
    e.stopPropagation()
  }

  const changeHandler = (e: any) => {
    setFilter(e.target.value)
  }

  return (
    <input
      className="filter-input no-focusborder"
      placeholder="search..."
      value={filterValue || ''}
      onChange={changeHandler}
      onClick={clickHandler}
    />
  )
}

export default TextFilter
