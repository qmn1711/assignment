import { FilteringProps } from '../../hooks/useTable.type'

import './TextFilter.scss'
import ClearIcon from '../../images/clear_icon.svg'

function TextFilter({ filterValue, setFilter }: FilteringProps) {
  const clickHandler = (e: any) => {
    e.stopPropagation()
  }

  const changeHandler = (e: any) => {
    setFilter(e.target.value)
  }

  const clickClearSearchHandler = (e: any) => {
    e.stopPropagation()
    setFilter('')
  }

  return (
    <div className="filter-input-wrapper">
      <input
        className="filter-input no-focusborder"
        placeholder="search..."
        value={filterValue || ''}
        onChange={changeHandler}
        onClick={clickHandler}
      />
      {filterValue && (
        <img className="close-icon" src={ClearIcon} alt="Clear Search" onClick={clickClearSearchHandler} />
      )}
    </div>
  )
}

export default TextFilter
