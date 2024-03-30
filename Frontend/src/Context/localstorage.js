const STORAGE_NAME = "role";

export const setLocalStorageRole = (role) => {
  localStorage.setItem(STORAGE_NAME, role);
};

export const removeLocalStorageRole = () => {
  localStorage.removeItem(STORAGE_NAME);
};

export const getLocalStorageRole = () => {
  let v = localStorage.getItem(STORAGE_NAME);
  return v;
};
