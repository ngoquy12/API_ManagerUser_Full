/**
 * Hàm fomat ngày - tháng -năm
 * @param {*} date : Chuỗi thời gian cần format
 * @returns Định dạng ngày - tháng - năm
 */
const formatDate = (date) => {
  // Lấy thời gian hiện tại
  let dateTime = new Date(date);
  // Lấy ra ngày
  let day = dateTime.getDate();
  if (day > 0 && day < 10) {
    day = `0${day}`;
  }
  // Lấy ra tháng
  let month = dateTime.getMonth() + 1; // Month trong js sẽ bắt đầu từ 0 đén 11
  if (month > 0 && month < 10) {
    month = `0${month}`;
  }
  // Lấy ra năm
  let year = dateTime.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Hàm fomat ngày - tháng -năm
 * @param {*} date : Chuỗi thời gian cần format
 * @returns Định dạng ngày - tháng - năm
 */
const formatDate1 = (date) => {
  // Lấy thời gian hiện tại
  let dateTime = new Date(date);
  // Lấy ra ngày
  let day = dateTime.getDate();
  if (day > 0 && day < 10) {
    day = `0${day}`;
  }
  // Lấy ra tháng
  let month = dateTime.getMonth() + 1; // Month trong js sẽ bắt đầu từ 0 đén 11
  if (month > 0 && month < 10) {
    month = `0${month}`;
  }
  // Lấy ra năm
  let year = dateTime.getFullYear();

  return `${year}-${month}-${day}`;
};

module.exports = { formatDate, formatDate1 };
