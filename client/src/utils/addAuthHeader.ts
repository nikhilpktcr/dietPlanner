export const addAuthHeader = (headers: Headers) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  } else if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        headers.set("authorization", `Bearer ${userData.token}`);
      }
    } catch (error) {
      // Handle JSON parse error silently
    }
  }

  return headers;
};
