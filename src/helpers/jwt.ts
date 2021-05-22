export const getJwt = () => {
  let jwt = "";
  try {
    jwt = localStorage.getItem("jwt") || "";
  } catch (error) {
    jwt = "";
  }

  return jwt;
};
