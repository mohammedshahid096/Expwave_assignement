import React, { useState, useContext, useEffect } from "react";
import {
  AddEmployeeService,
  GetEmployeeService,
  updatePhotoService,
  updateProfileService,
} from "../API_Services/employeeservice";
import { Store } from "../App";
import { useParams } from "react-router-dom";
import { imageServer } from "../Context/Server";

const DesignationOptions = ["HR", "Manager", "Sales"];
const CourseOptions = ["MCA", "BCA", "BSC"];

const AddEmp = ({ edit }) => {
  const { setnotificationtype, setmessage } = useContext(Store);
  const { id } = useParams();

  const [details, setdetails] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: "",
  });

  const [image, setimage] = useState(null);
  const [profile, setprofile] = useState(null);
  const [addDisable, setaddDisable] = useState(true);
  const [isEmailChange, setisEmailChange] = useState(false);

  const onchangeHandler = (e) => {
    let update = { ...details };
    update = { ...details, [e.target.name]: e.target.value };
    setdetails(update);
    let check = Object.values(update);
    if (check !== check.some((item) => item === "")) {
      setaddDisable(false);
    }

    if (id && e.target.name === "email") {
      setisEmailChange(true);
    }
  };

  const submitAddHandler = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    for (const [key, value] of Object.entries(details)) {
      formData.append(key, value);
    }
    formData.append("ProfileAvatar", image);
    const { success, statusCode, message } = await AddEmployeeService(formData);
    if (success) {
      setdetails({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        gender: "",
        course: "",
      });
      setimage(null);
      setnotificationtype("success");
      setmessage(message);
    } else {
      if (statusCode === 400) {
        setnotificationtype("danger");
      }
      if (statusCode === 404) {
        setnotificationtype("danger");
      }
      setmessage(message);
    }
  };

  const fetchSingleData = async () => {
    const { data, success, statusCode } = await GetEmployeeService(id);
    if (success) {
      setprofile(data?.image ? data.image : null);
      setdetails({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        designation: data.designation,
        gender: data.gender,
        course: data.course,
      });
    }
  };

  const updateProfileHandler = async () => {
    let tempDetails = { ...details };
    if (isEmailChange) {
      tempDetails.change = true;
    }
    tempDetails.change = false;

    const { success, data, statusCode, message } = await updateProfileService(
      id,
      tempDetails
    );

    if (success) {
      setnotificationtype("success");
      setmessage("successfully updated the profile");
      setisEmailChange(false);
    } else {
      setnotificationtype("danger");
      setmessage(message);
    }

    if (image) {
      const profileData = new FormData();
      profileData.append("ProfileAvatar", image);
      const { success, statusCode, message } = await updatePhotoService(
        id,
        profileData
      );
      if (success) {
        fetchSingleData();
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleData();
    }
  }, [id]);

  return (
    <div className="py-5">
      <form
        className="max-w-sm mx-auto text-primary-400"
        onSubmit={submitAddHandler}
      >
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Employee Name :
          </label>
          <input
            type="name"
            id="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Name"
            name="name"
            value={details.name}
            onChange={onchangeHandler}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Employee Email :
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="name@flowbite.com"
            value={details.email}
            name="email"
            onChange={onchangeHandler}
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Employee Phone :
          </label>
          <input
            type="phone"
            id="phone"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="1234567890"
            value={details.mobile}
            name="mobile"
            onChange={onchangeHandler}
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="gender" className="block mb-2 text-sm font-medium">
            Employee Gender :
          </label>

          <fieldset className="flex gap-3">
            <div className="flex items-center mb-4">
              <input
                id="country-option-3"
                type="radio"
                name="gender"
                value="female"
                checked={details.gender === "female"}
                onChange={onchangeHandler}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                radioGroup="gender"
                required
              />
              <label
                htmlFor="country-option-3"
                className="block ms-2 text-sm font-medium"
              >
                Female
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                id="country-option-4"
                type="radio"
                name="gender"
                value={"male"}
                checked={details.gender === "male"}
                onChange={onchangeHandler}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus-ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                required
                radioGroup="gender"
              />
              <label
                htmlFor="country-option-4"
                className="block ms-2 text-sm font-medium"
              >
                Male
              </label>
            </div>
          </fieldset>
        </div>

        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium"
            htmlFor="user_avatar"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            accept="image/jpeg, image/png"
            type="file"
            onChange={(e) => setimage(e.target.files[0])}
            required={id ? false : true}
          />
        </div>

        <div className="flex justify-between">
          <div className="mb-5">
            <label
              htmlFor="designation"
              className="block mb-2 text-sm font-medium"
            >
              Employee Designation :
            </label>

            <select
              id="designation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={onchangeHandler}
              name="designation"
              required
            >
              <option value="" selected={details.designation === ""}>
                select option
              </option>
              {DesignationOptions.map((item) => (
                <option
                  value={item}
                  key={item}
                  selected={item === details.designation}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label htmlFor="course" className="block mb-2 text-sm font-medium">
              Employee Course :
            </label>

            <select
              id="course"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={onchangeHandler}
              name="course"
              required
            >
              <option value="" selected={details.course === ""}>
                select option
              </option>
              {CourseOptions.map((item) => (
                <option
                  value={item}
                  key={item}
                  selected={item === details.course}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {id && profile && (
          <div>
            <img
              className="w-24 h-24 mb-3 rounded-full shadow-lg"
              src={`${imageServer}/static/photos/${profile}`}
              alt="image"
            />
          </div>
        )}

        {!id && !addDisable && image !== null && (
          <button
            type="submit"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Register new Employee
          </button>
        )}

        {id && (
          <button
            type="button"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={updateProfileHandler}
          >
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default AddEmp;
