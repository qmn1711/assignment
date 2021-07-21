import { useEffect, useRef, useState } from 'react'
import range from 'lodash/range'

interface Settings {
  itemHeight: number
  amount: number
  tolerance: number
  minIndex: number
  maxIndex: number
  startIndex: number
}

interface State {
  settings: Settings
  viewportHeight: number
  totalHeight: number
  toleranceHeight: number
  bufferHeight: number
  bufferedItems: number
  topPaddingHeight: number
  bottomPaddingHeight: number
  initialPosition: number
  data: number[]
}
export interface Props {
  className: string
  itemHeight: number
  amount: number
  maxIndex: number
  children: ({ index }: { index: number }) => void
}

const defaultSettings: Settings = {
  itemHeight: 0,
  amount: 0,
  tolerance: 3,
  minIndex: 0,
  maxIndex: 0,
  startIndex: 0,
}

const setInitialState = (itemHeight: number, amount: number, maxIndex: number): State => {
  const settings: Settings = {
    ...defaultSettings,
    itemHeight,
    amount,
    maxIndex,
  }
  const { tolerance, minIndex, startIndex } = settings

  const viewportHeight = amount * itemHeight
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight
  const toleranceHeight = tolerance * itemHeight
  const bufferHeight = viewportHeight + 2 * toleranceHeight
  const bufferedItems = amount + 2 * tolerance
  const itemsAbove = startIndex - tolerance - minIndex
  const topPaddingHeight = itemsAbove * itemHeight
  const bottomPaddingHeight = totalHeight - topPaddingHeight
  const initialPosition = topPaddingHeight + toleranceHeight

  return {
    settings,
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: [],
  }
}

function VirtualScroller({ itemHeight, amount, maxIndex, children, className }: Props) {
  const [state, setState] = useState(() => setInitialState(itemHeight, amount, maxIndex))
  const viewportElement = useRef<HTMLTableSectionElement>(null)

  const calculate = (currentState: State, scrollTop: number) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex, maxIndex, amount },
    } = currentState

    const currentHeight = scrollTop >= toleranceHeight ? scrollTop - toleranceHeight : 0
    const index = minIndex + Math.floor(currentHeight / itemHeight)
    const data: any = range(index, Math.min(index + bufferedItems, Math.max(maxIndex + 1, amount)))
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
    const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * itemHeight, 0)

    return {
      topPaddingHeight,
      bottomPaddingHeight,
      data,
    }
  }

  const runScroller = ({ target: { scrollTop } }: any) => {
    const result = calculate(state, scrollTop)

    setState({
      ...state,
      ...result,
    })
  }

  useEffect(() => {
    let newState = setInitialState(itemHeight, amount, maxIndex)
    newState = { ...newState, ...calculate(newState, 0) }
    setState(newState)
    if (viewportElement.current) {
      viewportElement.current.scrollTop = newState.initialPosition
    }
  }, [itemHeight, amount, maxIndex])

  const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = state

  return (
    <tbody className={className} ref={viewportElement} onScroll={runScroller} style={{ height: viewportHeight }}>
      <tr style={{ display: 'block', height: topPaddingHeight }} />
      {data.map((index: number) => {
        return children({ index })
      })}
      <tr style={{ display: 'block', height: bottomPaddingHeight }} />
    </tbody>
  )
}

export default VirtualScroller
