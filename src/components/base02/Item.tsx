import React, { useEffect, useRef } from "react";

export default function Item(props: any) {
  const { index, measure } = props;
  const element = useRef(null);

  useEffect(() => {
    measureItem(index);
  }, []);

  // 文本渲染完成
  const measureItem = (index: any) => {
    const item: any = element.current;
    if (item?.clientHeight) {
      measure(index, item.clientHeight);
    }
  };

  return (
    <div itemID={index} className="list-item" ref={element}>
      {props.children}
    </div>
  );
}
