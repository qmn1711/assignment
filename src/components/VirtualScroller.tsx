import React, { Component, useEffect, useRef, useState } from 'react';
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

const setInitialState2 = (settings: any) => {
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
    currentIndex: undefined,
  };
};

function VirtualScroller({ settings, getData, row }: any) {
  const [state, setState] = useState(() => setInitialState(settings));
  const viewportElement = useRef<HTMLDivElement>(null);

  const runScroller = ({ target: { scrollTop } }: any) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = state;
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data = getData(index, bufferedItems);
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    setState({
      ...state,
      topPaddingHeight,
      bottomPaddingHeight,
      data,
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

  const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = state;

  return (
    <div
      className="viewport"
      ref={viewportElement}
      onScroll={runScroller}
      style={{ height: viewportHeight }}
    >
      <div style={{ height: topPaddingHeight }} />
      {data.map(row)}
      <div style={{ height: bottomPaddingHeight }} />
    </div>
  );
}

export function VirtualScroller2({ settings, getData, row, children, className }: any) {
  const [state, setState] = useState(() => setInitialState2(settings));
  const viewportElement = useRef<HTMLDivElement>(null);

  const runScroller = ({ target: { scrollTop } }: any) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = state;
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data: any = range(index, index + bufferedItems);
    // const currentIndex = index;
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    setState({
      ...state,
      topPaddingHeight,
      bottomPaddingHeight,
      data,
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

  const { viewportHeight, topPaddingHeight, bottomPaddingHeight, data } = state;

  console.log('hello thereeee', data);

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
