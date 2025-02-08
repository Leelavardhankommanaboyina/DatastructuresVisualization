import React from "react";
import { Treemap } from "react-vis";

const TreeMap = ({ data }) => {
  return (
    <div>
      <Treemap
        width={500}
        height={500}
        data={data}
        colorRange={['#ff9e9e', '#00aaff']}
        colorDomain={[0, 100]}
      />
    </div>
  );
};

export default TreeMap;
