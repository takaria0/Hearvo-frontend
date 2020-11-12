export const getJwt = () => {
  const jwt = localStorage.getItem("jwt");
  return jwt;
}