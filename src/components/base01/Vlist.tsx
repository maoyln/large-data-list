import React, { useMemo, useRef, useState } from "react";
import "./Vlist.css";

export default function Vlist(props: any) {
  const { list = [] } = props;

  const viewport = useRef(null); // 可视区域

  // 每项列表的高度
  const itemSize = 100;
  // 列表总高度
  const phantomHeight = list.length * itemSize;
  // 渲染数量
  const viewCount = 10;
  // 开始index
  const [startIndex, setStartIndex] = useState(0);
  // 结束index
  const endIndex = useMemo(() => startIndex + viewCount, [startIndex]);
  // 偏移量
  const [startOffset, setStartOffset] = useState(0);

  // 获取startIndex
  const getStartIndex = (scrollTop: any) => {
    return Math.floor(scrollTop / itemSize);
  };

  // 获取startOffset
  const getStartOffset = (startIndex: any) => {
    return startIndex * itemSize;
  };

  // 是否在显示范围之间
  const isBetweenViewRanges = (index: any) => {
    return index >= startIndex && index <= endIndex;
  };

  /**
   * 获取滚动距离 scrollTop
   * 根据 scrollTop 和 itemSize 计算出 startIndex 和 endIndex
   * 根据 scrollTop 和 itemSize 计算出 startOffset
   * 显示startIndex 和 endIndex之间的元素
   * 设置listArea的偏移量为startOffset
   */
  const handleScroll = () => {
    const scrollTop = viewport.current?.scrollTop; // 滚动距离
    console.log(scrollTop);
    const startIndex = getStartIndex(scrollTop);
    setStartIndex(startIndex); // 获取开始位置

    const startOffset = getStartOffset(startIndex); // 获取开始偏移量
    setStartOffset(startOffset);
  };

  return (
    <div className="viewport" ref={viewport} onScroll={handleScroll}>
      <div
        className="list-phantom"
        style={{ height: `${phantomHeight}px` }}
      ></div>
      <div
        className="list-area"
        style={{ transform: `translate3d(0,${startOffset}px,0)` }}
        // style={{ transform: `translateY(${startOffset}px)` }}
      >
        {list.map(
          (item: any, index: any) =>
            isBetweenViewRanges(index) && (
              <div
                key={item.id}
                className="list-item"
                style={{ height: itemSize + "px", lineHeight: itemSize + "px" }}
              >
                {item.id}
              </div>
            )
        )}
      </div>
    </div>
  );
}
