import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Vlist.css";

export default function Vlist(props) {
  const { list = [] } = props;
  const viewport = useRef(null); // 可视区域
  const listArea = useRef(null); // 渲染区域
  const phantom = useRef(null); // 占位区域，列表总高度

  // 预估高度
  const defaultItemSize = 100;
  // 记录列表项的位置信息
  const [positions, setPositions] = useState(
    list.map((item, index) => {
      return {
        index,
        height: defaultItemSize,
        top: index * defaultItemSize,
        bottom: (index + 1) * defaultItemSize
      };
    })
  );

  // 列表总高度
  const [phantomHeight, setPhantomHeight] = useState(
    positions.reduce((total, item) => total + item.height, 0)
  );

  const viewCount = 20; // 渲染数量
  const [startIndex, setStartIndex] = useState(0); // 开始index
  // 结束index
  const endIndex = useMemo(() => startIndex + viewCount, [startIndex]);
  const [startOffset, setStartOffset] = useState(0); // 偏移量

  useEffect(() => {
    if (positions?.length) {
      const totalHeight = positions.reduce(
        (total, item) => total + item.height,
        0
      );
      setPhantomHeight(totalHeight);
    }
  }, [positions]);

  // 测量高度
  const measure = (index, height) => {
    // 如果没有传入height，主动进行测量
    if (height === undefined) {
      height =
        listArea.current.querySelector(`[itemID="${index}"]`)?.clientHeight ||
        defaultItemSize;
    }

    positions.forEach((item) => {
      if (item.index === index) {
        let oldHeight = item.height;
        let dHeight = oldHeight - height;

        // 向下更新
        if (dHeight) {
          item.height = height;
          item.bottom = item.bottom - dHeight;

          for (let k = index + 1; k < positions.length; k++) {
            positions[k].top = positions[k - 1].bottom;
            positions[k].bottom = positions[k].bottom - dHeight;
          }
        }
      }
    });
    setPositions(positions);
  };

  // 获取startIndex
  const getStartIndex = (scrollTop) => {
    let item = positions.find((i) => i && i.bottom > scrollTop);
    return item.index;
  };

  // 获取startOffset
  const getStartOffset = (startIndex) => {
    return startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
  };

  /**
   * 获取滚动距离 scrollTop
   * 根据 scrollTop 和 itemSize 计算出 startIndex 和 endIndex
   * 根据 scrollTop 和 itemSize 计算出 startOffset
   * 显示startIndex 和 endIndex之间的元素
   * 设置listArea的偏移量为startOffset
   */
  const onScroll = () => {
    const scrollTop = viewport.current.scrollTop; // 滚动距离
    const startIndex = getStartIndex(scrollTop);
    setStartIndex(startIndex);

    const startOffset = getStartOffset(startIndex);
    setStartOffset(startOffset);
  };

  return (
    <div className="viewport" ref={viewport} onScroll={onScroll}>
      <div
        className="list-phantom"
        ref={phantom}
        style={{ height: `${phantomHeight}px` }}
      ></div>
      <div
        className="list-area"
        ref={listArea}
        style={{ transform: `translate3d(0,${startOffset}px,0)` }}
      >
        {list.map(
          (item, index) =>
            index >= startIndex &&
            index <= endIndex &&
            props.children({
              index,
              item,
              measure
            })
        )}
      </div>
    </div>
  );
}
