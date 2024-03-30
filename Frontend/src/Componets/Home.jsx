import React, { useState, useEffect, useContext } from "react";
import DataTable from "react-data-table-component";
import {
  AllEmployeeService,
  DeleteEmployeeService,
} from "../API_Services/employeeservice";
import { Store } from "../App";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { imageServer } from "../Context/Server";
import { getLocalStorageRole } from "../Context/localstorage";

const TYPE = getLocalStorageRole();

const Home = () => {
  const [allEmployee, setallEmployee] = useState([]);
  const [filterdata, setfilterdata] = useState([]);
  const { setnotificationtype, setmessage } = useContext(Store);
  const [openDeleteModal, setopenDeleteModal] = useState(null);
  const navigate = useNavigate();

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    },
    headCells: {
      style: {
        color: "white",
      },
    },
    rows: {
      style: {
        backgroundColor: "black",
        color: "white",
      },
    },
    pagination: {
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: "Course",
      selector: (row) => row.course,
      sortable: true,
    },

    {
      name: "date",
      selector: (row) => row.date,
      sortable: true,
    },
  ];

  TYPE === "admin" &&
    columns.push({
      name: "Action",
      selector: (row) => row.action,
    });

  const fetchAllExmployees = async () => {
    const { success, data, statusCode, message } = await AllEmployeeService();
    if (success) {
      let update = [...data];
      update = update.map((item) => {
        const action =
          TYPE === "admin" ? (
            <div className="flex gap-2 " key={item._id}>
              <button
                type="button"
                className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-xl px-3 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                onClick={() => navigate(`/single/${item._id}`)}
              >
                <FaEdit />
              </button>
              <button
                type="button"
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl px-3 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setopenDeleteModal(item._id)}
              >
                <MdDelete />
              </button>
            </div>
          ) : null;

        return {
          ...item,
          image: (
            <img
              src={`${imageServer}/static/photos/${item?.image}`}
              alt="logo"
              className="w-10 h-10 rounded-full shadow-lg"
              onError={(e) =>
                (e.target.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAtHsq1rN5qNrtHfvmLTx8p2CGo3pPdqqkA&usqp=CAU")
              }
            />
          ),
          date: moment(item.createdAt).format("D MMM"),
          action,
        };
      });
      setfilterdata(update);
      setallEmployee(update);
    } else {
      setnotificationtype("danger");
      setmessage(message);
    }
  };

  const handleFilter = (event) => {
    const newData = allEmployee.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );
    setfilterdata(newData);
  };

  useEffect(() => {
    fetchAllExmployees();
  }, []);

  return (
    <div className="p-3 justify-center bg-black">
      <div>
        <div>
          <input
            type="text"
            id="first_name"
            className="bg-gray-50 w-1/5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="search....."
            onChange={handleFilter}
          />
          <br />
          <div className="text-primary-400 text-3xl font-bold text-center pb-3">
            Employees
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filterdata}
          fixedHeader
          pagination
          highlightOnHover
          customStyles={customStyles}
        />
      </div>

      {openDeleteModal && (
        <ModalOpen
          empid={openDeleteModal}
          setopenDeleteModal={setopenDeleteModal}
          setallEmployee={setallEmployee}
          setfilterdata={setfilterdata}
          allEmployee={allEmployee}
        />
      )}
    </div>
  );
};

const ModalOpen = ({
  empid,
  setopenDeleteModal,
  allEmployee,
  setallEmployee,
  setfilterdata,
}) => {
  const { setnotificationtype, setmessage } = useContext(Store);
  const submitDeleteHandler = async () => {
    const { success, statusCode, message } = await DeleteEmployeeService(empid);
    if (success) {
      let update = [...allEmployee];
      update = update.filter((item) => item._id !== empid);
      setallEmployee(update);
      setfilterdata(update);
      setopenDeleteModal(null);
      setnotificationtype("success");
    } else {
      setnotificationtype("danger");
    }
    setmessage(message);
  };
  return (
    <div
      id="popup-modal"
      tabIndex="-1"
      className=" overflow-y-auto  fixed top-3 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relativ p-4 w-full max-w-md max-h-full ">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 left-full">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={() => setopenDeleteModal(null)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <div className="flex justify-center text-gray-500">
              <span className="text-[5rem]">
                <RiErrorWarningLine />
              </span>
            </div>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={submitDeleteHandler}
            >
              Yes, I'm sure
            </button>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={() => setopenDeleteModal(null)}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
