const getDate = (day = 1, month = 1, year = 2021) => {
  day = day.toString().padStart(2, '0');
  month = month.toString().padStart(2, '0');

  return `${day}/${month}/${year}`;
};

module.exports = getDate;
