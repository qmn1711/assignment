import React, { useEffect, useRef, useState } from 'react';
import range from 'lodash/range';

interface Settings {
  itemHeight: number;
  amount: number;
  tolerance: number;
  minIndex: number;
  maxIndex: number;
  startIndex: number;
}
interface Props {
  className: string;
  itemHeight: number;
  amount: number;
  maxIndex: number;
  children: ({ index }: { index: number }) => void;
}

const defaultSettings: Settings = {
  itemHeight: 0,
  amount: 0,
  tolerance: 0,
  minIndex: 0,
  maxIndex: 0,
  startIndex: 1,
};

const setInitialState = (
  itemHeight: number,
  amount: number,
  maxIndex: number
) => {
  const settings: Settings = {
    ...defaultSettings,
    itemHeight,
    amount,
    maxIndex,
  };
  const { tolerance, minIndex, startIndex } = settings;

  const viewportHeight = amount * itemHeight;
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight = tolerance * itemHeight;
  const bufferHeight = viewportHeight + 2 * toleranceHeight;
  const bufferedItems = amount + 2 * tolerance;
  const itemsAbove = startIndex - tolerance - minIndex;
  const topPaddingHeight = itemsAbove * itemHeight;
  const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const initialPosition = topPaddingHeight + toleranceHeight;
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
  };
};

function VirtualScroller({
  itemHeight,
  amount,
  maxIndex,
  children,
  className,
}: Props) {
  const [state, setState] = useState(() =>
    setInitialState(itemHeight, amount, maxIndex)
  );
  const viewportElement = useRef<HTMLDivElement>(null);

  const calculate = (currentState: any, scrollTop: number) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = currentState;
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data: any = range(index, index + bufferedItems);
    // const currentIndex = index;
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    return {
      topPaddingHeight,
      bottomPaddingHeight,
      data,
    };
  };

  const runScroller = ({ target: { scrollTop } }: any) => {
    const result = calculate(state, scrollTop);

    setState({
      ...state,
      ...result,
    });
  };

  useEffect(() => {
    if (viewportElement.current) {
      viewportElement.current.scrollTop = state.initialPosition;

      if (state.initialPosition) {
        runScroller({ target: { scrollTop: 0 } });
      }
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    let newState = setInitialState(itemHeight, amount, maxIndex);
    newState = { ...newState, ...calculate(newState, 0) };
    setState(newState);
    if (viewportElement.current) {
      viewportElement.current.scrollTop = newState.initialPosition;
    }
  }, [itemHeight, amount, maxIndex]);

  const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = state;

  return (
    <div
      className={className}
      ref={viewportElement}
      onScroll={runScroller}
      style={{ height: viewportHeight }}
    >
      <div style={{ height: topPaddingHeight }} />
      {data.map((index: number) => {
        return children({ index });
      })}
      <div style={{ height: bottomPaddingHeight }} />
    </div>
  );
}

export default VirtualScroller;
