export default (year = new Date().getFullYear(), month = new Date().getMonth() + 1) => {
  const weeks = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const date = new Date(year, month - 1, 1);
  const result = [];
  while (date.getMonth() == month - 1) {
    result.push({
      date: date.getDate(),
      week: weeks[date.getDay()]
    });
    date.setDate(date.getDate() + 1);
  }
  return result;
};