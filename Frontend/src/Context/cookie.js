import Cookies from "js-cookie";
const cookieName = "isLogin";

/**
 * The function sets a login token cookie with specific options.
 */
export const setLoginTokenCookie = () => {
  const cookieoptions = {
    sameSite: "None",
    secure: true,
    expires: new Date(Date.now() + 1 * 8640000), // for day
  };
  Cookies.set(cookieName, "true", cookieoptions);
};

/**
 * The function removes a login cookie.
 */
export const removeLoginCookie = () => {
  Cookies.remove(cookieName);
};

/**
 * The GetCookie function retrieves the value of a cookie named cookieName.
 * @returns The function `GetCookie` returns the value of the `cookie_token` variable.
 */
const GetCookie = () => {
  const cookie_token = Cookies.get(cookieName);
  return cookie_token;
};

export default GetCookie;
