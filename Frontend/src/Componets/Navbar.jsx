import React, { useEffect, useState, useContext } from "react";
import { MdMenu } from "react-icons/md";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogoutService, myProfileService } from "../API_Services/authservice";
import { Store } from "../App";
import { removeLoginCookie } from "../Context/cookie";
import LogoImage from "../assets/expwave.png";
import {
  getLocalStorageRole,
  removeLocalStorageRole,
  setLocalStorageRole,
} from "../Context/localstorage";

const RoutesItems = {
  admin: [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/dashboard",
      name: "Dashboard",
    },
    {
      link: "/add",
      name: "Add",
    },
  ],
  user: [
    {
      link: "/",
      name: "Home",
    },
    {
      link: "/dashboard",
      name: "Dashboard",
    },
  ],
};

const TYPE = getLocalStorageRole();
console.log(TYPE);

const Navbar = () => {
  const [profile, setprofile] = useState(null);
  const { setnotificationtype, setmessage, setisAuth } = useContext(Store);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchdata = async () => {
    const { success, data, statusCode } = await myProfileService();
    if (statusCode === 401) {
      navigate("/login");
      removeLoginCookie();
      setisAuth(false);
    }
    setprofile(data);
    setLocalStorageRole(data.role);
  };

  const logoutFunction = async () => {
    const { success, message } = await LogoutService();
    if (success) {
      setnotificationtype("success");
      setmessage(message);
      navigate("/login");
      setisAuth(false);
      removeLoginCookie();
      removeLocalStorageRole();
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <nav className="bg-black text-primary-400 border-gray-200 dark:bg-gray-900 border-b-white border-b-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={LogoImage} className="h-10 rounded-md" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Expwave
          </span>
        </a>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="text-[2.5rem]">
            <MdMenu />
          </span>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex items-center flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 text-primary-400">
            {RoutesItems[TYPE].map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`block py-2 px-3 hover:text-white ${
                    location.pathname === item.link ? "text-white" : ""
                  }`}
                  aria-current="page"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <span>{profile?.email}</span>
            </li>
            <li>
              <button
                type="button"
                className="text-gray-900 hover:text-primary-400 hover:bg-white border hover:border-primary-400 border-gray-800 bg-primary-400 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={logoutFunction}
              >
                logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
