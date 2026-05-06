export const formatTime = (dt) => {
  if (!dt) return "--:--";
  try {
    return dt.split("T")[1].slice(0, 5);
  } catch (e) {
    return "--:--";
  }
};

export const formatDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });
};

export const formatFullDate = (dt) => {
  if (!dt) return "";
  return new Date(dt).toLocaleDateString("en-IN", {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

export const calcDuration = (dep, arr) => {
  if (!dep || !arr) return "";
  const diff = (new Date(arr) - new Date(dep)) / 60000;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h ${minutes}m`;
};
