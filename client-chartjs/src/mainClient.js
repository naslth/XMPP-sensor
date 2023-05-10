import React from "react";

import ListSensor from "./component/left-main-page/ListSensor";
import ListChart from "./component/right-main-page/ListChart";

const MainClient = () => {
    
  return (
    <div>
      <div className="row">
        <div className="col-md-4" style={{height: '100%'}}>
            <ListSensor />
        </div>
        <div className="col-md-8" style={{height: '100%'}}>
            <ListChart />
        </div>
      </div>
    </div>
  );
};

export default MainClient;