import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Skeleton from "react-loading-skeleton";

export default function Vlist(props) {
  const { list = [] } = props;
  const viewport = useRef(null); // 可视区域
  const listArea = useRef(null); // 渲染区域
  const phantom = useRef(null); // 占位区域，列表总高度

  // 列表前后缓存条数
  const buffered = 10;

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

  const viewCount = 10; // 渲染数量
  const [startIndex, setstartIndex] = useState(0); // 开始index
  // 结束index
  const endIndex = useMemo(
    () => Math.min(startIndex + viewCount + buffered, list.length),
    [startIndex, list.length]
  );
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

  // 获取startIndex 二分查找法
  const getStartIndex = (scrollTop) => {
    // let item = positions.find((i) => i && i.bottom > scrollTop);
    let item = binarySearch(positions, scrollTop);
    return Math.max(0, item - buffered);
  };

  //二分法查找
  const binarySearch = (positions, value) => {
    let start = 0; //开始
    let end = positions.length - 1; //结束位置
    let temp = null; //记录当前的高度临时值
    //当开始位置小于结束的位置的时候，就一直往下找
    while (start <= end) {
      //找到中间的位置
      let middleIndex = (start + end) / 2;
      //中间位置bottom位置
      let middleValue = positions[middleIndex].bottom;
      //如果当前的middleValue与value相等，则可进行
      if (middleValue === value) {
        return middleIndex + 1;
      } else if (middleValue < value) {
        //当前要查找的在右边
        start = middleIndex + 1;
      } else if (middleValue > value) {
        //当前要查找的在左边
        //  temp为存储的临时数据 如果不存在middleValue == value的时候 返回这个临时的数据
        if (temp == null || temp > middleIndex) {
          temp = middleIndex; //找到范围
        }
        end = middleIndex - 1;
      }
    }
    return temp;
  };

  // 获取startOffset
  const getStartOffset = (startIndex) => {
    return startIndex >= 1 ? positions[startIndex].top : 0;
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
    setstartIndex(startIndex);

    const startOffset = getStartOffset(startIndex);
    setStartOffset(startOffset);
  };

  // 是否在指定的范围中
  const isBetweenRanges = useCallback(
    (index) => {
      return index >= startIndex && index <= endIndex;
    },
    [startIndex, endIndex]
  );

  console.log(startOffset, 'startOffset--012');
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
        {list.map((item, index) => (
          <div key={index} style={{ minHeight: positions[index].height }}>
            {isBetweenRanges(index) ? (
              props.children({
                index,
                item,
                measure
              })
            ) : (
              <Skeleton height={20} count={5} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
