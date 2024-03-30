import ReactApexChart from "react-apexcharts";

export function Gender({ employees }) {
  console.log(employees);
  const options = {
    align: "center",
    chart: {
      height: 200,
      type: "donut",
      align: "center",
    },
    labels: ["Male", "Female"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      show: true,
    },
    title: {
      text: "Gender Distribution",
    },
    // colors: ["var(--chart-color4)", "var(--chart-color3)"],
    // series: [employees?.boys, employees?.girls],
    responsive: [
      {
        breakpoint: 45,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = employees && employees.map((item) => item.count);

  return (
    <ReactApexChart
      options={options}
      series={(employees && series) || []}
      type="donut"
      width={450}
    />
  );
}

export const RenderChart = ({ data, title, xaxis }) => {
  const series = data && data.map((item) => item.count);
  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: data && data.map((item) => item._id),
      title: {
        text: xaxis,
      },
    },
    title: {
      text: title,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: "count", data: series }]}
      type="bar"
      height={400}
      width={500}
    />
  );
};

export const GenderWiseCourse = ({ data, title }) => {
  const groupedData =
    data &&
    data.reduce((acc, curr) => {
      if (!acc[curr.course]) {
        acc[curr.course] = { male: 0, female: 0 };
      }
      acc[curr.course][curr.gender] += curr.count;
      return acc;
    }, {});

  const courses = groupedData && Object.keys(groupedData);
  const maleCounts =
    groupedData && courses.map((course) => groupedData[course].male);
  const femaleCounts =
    groupedData && courses.map((course) => groupedData[course].female);

  const options = {
    chart: {
      id: "gender-wise-designation-chart",
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: courses,
    },
    title: {
      text: title,
    },
    colors: ["#008FFB", "#FF4560"],
  };

  const series = [
    {
      name: "Male",
      data: maleCounts,
    },
    {
      name: "Female",
      data: femaleCounts,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={(data && series) || []}
      type="bar"
      height="350"
      width={450}
    />
  );
};

export const GenderWiseDesignation = ({ data, title }) => {
  console.log(data);
  const groupedData =
    data &&
    data.reduce((acc, curr) => {
      if (!acc[curr.designation]) {
        acc[curr.designation] = { male: 0, female: 0 };
      }
      acc[curr.designation][curr.gender] += curr.count;
      return acc;
    }, {});

  const courses = groupedData && Object.keys(groupedData);
  const maleCounts =
    groupedData && courses.map((course) => groupedData[course].male);
  const femaleCounts =
    groupedData && courses.map((course) => groupedData[course].female);

  const options = {
    chart: {
      id: "gender-wise-designation-chart",
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: courses,
    },
    title: {
      text: title,
    },
    colors: ["#008FFB", "#FF4560"],
  };

  const series = [
    {
      name: "Male",
      data: maleCounts,
    },
    {
      name: "Female",
      data: femaleCounts,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={(data && series) || []}
      type="bar"
      height="350"
      width={450}
    />
  );
};
