import React from "react";
import './ListChart.scss';

import LineChartDemo from "../line-chart/LineChart";

const ListChart = () => {
    return (
        <div className="list-chart">
            <h3 style={{ textAlign: "center" }}>Danh sách các biểu đồ</h3>
            <div>
                <table className="table-list-chart">
                    <tr>
                        <td><LineChartDemo /></td>
                        <td><LineChartDemo /></td>
                    </tr>
                    <tr>
                        <td><LineChartDemo /></td>
                        <td><LineChartDemo /></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
export default ListChart;