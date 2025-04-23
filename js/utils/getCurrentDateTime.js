const getCurrentDateTime = () => {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  const dateTimeString = `${dateString} ${timeString}`;
  return dateTimeString;
};
