import React, { useEffect, useState } from "react";
import {
  Gender,
  GenderWiseCourse,
  GenderWiseDesignation,
  RenderChart,
} from "./Graphs/Gender";
import { DashboardService } from "../API_Services/employeeservice";

const Dashboard = () => {
  const [allData, setallData] = useState(null);
  const fetchDashboardData = async () => {
    const {
      success,
      genderDistribution,
      designationDistribution,
      courseDistribution,
      genderWiseCourse,
      genderWiseDesignation,
    } = await DashboardService();
    if (success) {
      setallData({
        genderDistribution,
        designationDistribution,
        genderWiseCourse,
        courseDistribution,
        genderWiseDesignation,
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="p-5">
      <div className="mb-4 grid grid-cols-2">
        <div className="bg-gray-100 flex justify-center pt-3">
          <Gender employees={allData ? allData.genderDistribution : null} />
        </div>
      </div>
      <div className="grid grid-cols-2  gap-4">
        <div className="bg-gray-100 flex justify-center pt-3">
          <RenderChart
            data={allData ? allData.designationDistribution : null}
            title={"Designation Distribution"}
            xaxis={"Designation"}
          />
        </div>
        <div className="bg-gray-100 flex justify-center pt-3">
          <RenderChart
            data={allData ? allData.courseDistribution : null}
            title={"Course Distribution"}
            xaxis={"Course"}
          />
        </div>
        <div className="bg-gray-100 flex justify-center pt-3">
          <GenderWiseDesignation
            data={allData ? allData.genderWiseDesignation : null}
            title={"gender wise designation"}
          />
        </div>
        <div className="bg-gray-100 flex justify-center pt-3">
          <GenderWiseCourse
            data={allData ? allData.genderWiseCourse : null}
            title={"gender wise course"}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
