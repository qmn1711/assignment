import React, { Component, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import range from 'lodash/range';

const setInitialState = (settings: any) => {
  const { itemHeight, amount, tolerance, minIndex, maxIndex, startIndex } =
    settings;
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

function VirtualScroller({ settings, children, className }: any) {
  const [state, setState] = useState(() => setInitialState(settings));
  const viewportElement = useRef<HTMLDivElement>(null);

  const calculate = (settings: any, scrollTop: number) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = settings;
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
      data
    }
  }

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
  }, []);
  
  useEffect(() => {
    let newSettings = setInitialState(settings);
    newSettings = { ...newSettings, ...calculate(newSettings, 0) };
    setState(newSettings);
    if (viewportElement.current) {
      viewportElement.current.scrollTop = newSettings.initialPosition;
    }
  }, [settings]);

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

        return children({index});
      })}
      <div style={{ height: bottomPaddingHeight }} />
    </div>
  );
}

export default VirtualScroller;
