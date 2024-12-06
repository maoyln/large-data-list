import React from "react";
import VList from "../../components/base01/Vlist";

let data: any[] = [];
for (let id = 0; id < 1000; id++) {
  data.push({
    id
  });
}

function BaseRC() {
  return (
    <div className="BaseRC">
      <VList list={data}></VList>
    </div>
  );
}
export default BaseRC;
