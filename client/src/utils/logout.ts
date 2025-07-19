export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
  // Dispatch a custom event to notify components about logout
  window.dispatchEvent(new CustomEvent('userLogout'));
  window.location.href = "/login";
};
