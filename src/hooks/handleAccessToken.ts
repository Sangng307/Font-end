export const addAccessToken = (accessToken: string) => {
  localStorage.setItem("refine-auth", accessToken);
};
export const getAccessTokem = () => {
  try {
    const accessToken = localStorage.getItem("refine-auth");
    return accessToken;
  } catch (err) {
    console.log("handle get access token error ", err);
  }
  return "";
};

export const addUserNameToStorage = (username: string) => {
  localStorage.setItem("username", username);
};

export const getUsernameFromStorage = () => {
  return localStorage.getItem("username");
};

export const addUserId = (userId: number) => {
  document.cookie = `userId=${userId}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};
