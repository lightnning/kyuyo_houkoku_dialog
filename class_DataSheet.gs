function main() {

  // Dialog表示
  const response = Dialog.showDialog('給与支払報告書pdf作成', '作成する給与支払年を入力してください(xxxx)');
  // const response = '2022'; // <= test用

  // 名簿シート処理
  const memberSh = new DataSheet('15nC-YZyeds7kyZE61VNtdLjNLyuAQ38Yt-9iNov6ScU', '名簿');
  const memberObj = memberSh.toObj();
  const deleteKeyMember = ['no.', 'etc1', 'etc2',]; // 不要な列項目

  memberObj
    .map((key) => {
      for (const element of deleteKeyMember) {
        delete key[element]; // 不必要な列データを削除する
      }
    })
  // console.log(memberObj);

  // 給与支払明細シート処理
  const kyuyoShiharaiSh = new DataSheet('15nC-YZyeds7kyZE61VNtdLjNLyuAQ38Yt-9iNov6ScU', '給与支払明細');
  const kyuyoShiharaiObj = kyuyoShiharaiSh.toObj();
  var filteredkyuyoShiharaiObj = kyuyoShiharaiObj.filter(data => data['yearMonth'].includes(response)); //responseデータに絞る
  // console.log(filteredkyuyoShiharaiObj);
  var nenkanKyuyoObj = [...
    filteredkyuyoShiharaiObj.reduce(
      (m, item) => m.set(item.name, (m.get(item.name) || 0) + item.kyuyo)
      , new Map()
    )].map(([name, nenkanKyuyo]) => ({ name, nenkanKyuyo }));
  // console.log(nenkanKyuyoObj);

  // 名簿データと給与支払明細データを名前でmergeする
  var kyuyoHoukokuObj = [];
  nenkanKyuyoObj.map((element) => {
    memberObj.map((member) => {
      if (element.name === member.name) { //名前が一緒のobjctをmergeする
        Object.assign(member, element);
        kyuyoHoukokuObj.push(member);
      }
    })
  });
  console.log(kyuyoHoukokuObj); // 最終データ

  // 給与支払報告書のデータを帳票に入力して、個人ごとにPDF化して指定のフォルダに保存するスクリプト
  // 帳票シートのインスタンス化
  const kyuyoHoukokuForm = new FormSheet('15nC-YZyeds7kyZE61VNtdLjNLyuAQ38Yt-9iNov6ScU', '給与支払報告書');
  const setData = [
    ['行番', '列番', 'key',],
    [5, 14, 'address',],
    [5, 56, 'myNumber',],
    [7, 50, 'furigana',],
    [8, 50, 'name',],
    [11, 20, 'nenkanKyuyo',],
    [52, 57, 'gengo',],
    [52, 68, 'year',],
    [52, 72, 'month',],
    [52, 76, 'day',],
  ];
  // 保存するフォルダID
  const folderId = '*******************'; // <= 各自で任意のフォルダを指定してください

  if (response == null) {
    Browser.msgBox('キャンセルしました');
    return;
  }
  if (response == '') {
    Browser.msgBox('データを入力してください');
    return;
  }
  if (kyuyoHoukokuObj.length == 0) {
    Browser.msgBox('データがありません');
    return;
  } else {
    // setDataを元にした繰り返し処理
    kyuyoHoukokuObj.map((element) => {
      const last_element = setData.length - 1  // setData要素数(見出し配列を除くため -1)
      for (let i = 1; i < setData.length; i++) { // setDataの要素ごとに繰り返し処理をする
        const e = setData[i];
        console.log(`last_element=${last_element} i=${i} setSheet => セル位置:${e[0]},${e[1]} ${e[2]}:${element[e[2]]}`);
        kyuyoHoukokuForm.setSheet.getRange(e[0], e[1]).setValue(element[e[2]]); // スプレッドシートへのデータ入力
        SpreadsheetApp.flush(); // スプレッドシートの再描画 
        if (i === last_element) {　// setDataの最後の要素の繰り返し処理が終了したところでPDF化して指定のフォルダに保存する
          console.log('最後のデータが入力された後、pdf化して保存');
          kyuyoHoukokuForm.savePdf(folderId, `給与支払報告書_${element['name']}_${response}`);
        }
      }
    });
    Browser.msgBox('pdfフォルダに保存しました');
  }




}
