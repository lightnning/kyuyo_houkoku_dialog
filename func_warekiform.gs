// https://qiita.com/suin/items/9799837779fd02f6333f
// Google Spreadsheetで西暦を和暦にカンタンに変換する関数 (DateTimeFormatを利用)

const warekiFormat = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  era: "long",
  year: "numeric",
});

/**
 * 日付から和暦の年を返す
 * @param {number|Date} date - 日付
 * @return {string} 和暦の年の文字列
 * @customfunction
 */
function WAREKI(date) {
  let dateObject;
  if (typeof date === "number") {
    dateObject = new Date(date, 0, 1);
  } else if (date instanceof Date) {
    dateObject = date;
  } else {
    throw new Error("Invalid date " + typeof date);
  }
  return warekiFormat.format(dateObject);
}