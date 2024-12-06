import React, { useEffect, useMemo, useRef, useState } from "react";
import './Vlist.css'

export default function Vlist(props: any) {
  const { list = [] } = props;
  const viewport = useRef<any>(null); // 可视区域
  const listArea = useRef<any>(null); // 渲染区域
  const phantom = useRef<any>(null); // 占位区域，列表总高度

  // 预估高度
  const defaultItemSize = 100;
  // 记录列表项的位置信息
  const [positions, setPositions] = useState(
    list.map((item: any, index: any) => {
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
    positions.reduce((total: any, item: any) => total + item.height, 0)
  );

  const viewCount = 10; // 渲染数量
  const [startIndex, setStartIndex] = useState(0); // 开始index
  // 结束index
  const endIndex = useMemo(() => startIndex + viewCount, [startIndex]);
  const [startOffset, setStartOffset] = useState(0); // 偏移量

  useEffect(() => {
    if (positions?.length) {
      const totalHeight = positions.reduce(
        (total: any, item: any) => total + item.height,
        0
      );
      setPhantomHeight(totalHeight);
    }
  }, [positions]);

  // 测量高度
  const measure = (index: any, height: any) => {
    // 如果没有传入height，主动进行测量
    if (height === undefined) {
      height =
        listArea.current.querySelector(`[itemID="${index}"]`)?.clientHeight ||
        defaultItemSize;
    }

    positions.forEach((item: any) => {
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
  const getStartIndex = (scrollTop: any) => {
    let item = positions.find((i: any) => i && i.bottom > scrollTop);
    return item.index;
  };

  // 获取startOffset
  const getStartOffset = (startIndex: any) => {
    return startIndex >= 1 ? positions[startIndex - 1].bottom : 0;
  };

  // 深度拷贝
  

  /**
   * 获取滚动距离 scrollTop
   * 根据 scrollTop 和 itemSize 计算出 startIndex 和 endIndex
   * 根据 scrollTop 和 itemSize 计算出 startOffset
   * 显示startIndex 和 endIndex之间的元素
   * 设置listArea的偏移量为startOffset
   */
  const handleScroll = () => {
    const scrollTop = viewport.current.scrollTop; // 滚动距离
    const startIndex = getStartIndex(scrollTop);
    setStartIndex(startIndex);

    const startOffset = getStartOffset(startIndex);

    setStartOffset(startOffset);
  };

    // 是否在显示范围之间
    const isBetweenViewRanges = (index: any) => {
      return index >= startIndex && index <= endIndex;
    };

  return (
    <div className="viewport" ref={viewport} onScroll={handleScroll}>
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
          (item: any, index: any) =>
          isBetweenViewRanges(index) &&
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
