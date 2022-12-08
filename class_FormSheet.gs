'use strict'

class FormSheet {

  constructor(ssId, shName,) {
    this.ssId = ssId;
    this.shName = shName;
    this.setSs = SpreadsheetApp.openById(this.ssId);
    this.setSheet = this.setSs.getSheetByName(this.shName);
  }
  
  // シートをpdf化して、指定したフォルダに指定したファイル名で保存する
  savePdf(folderId, fileName) {
    const setSsId = this.setSs.getId();
    const setSheetId = this.setSheet.getSheetId();

    //PDFを作成するためのベースとなるURL
    let baseUrl = "https://docs.google.com/spreadsheets/d/"
      + setSsId
      + "/export?gid="
      + setSheetId;

    //★★★自由にカスタマイズしてください★★★
    //PDFのオプションを指定
    let pdfOptions = "&exportFormat=pdf&format=pdf"
      + "&size=A5" //用紙サイズ (A4)
      + "&portrait=true"  //用紙の向き true: 縦向き / false: 横向き
      + "&fitw=true"  //ページ幅を用紙にフィットさせるか true: フィットさせる / false: 原寸大
      + "&top_margin=0.25" //上の余白
      + "&right_margin=0.25" //右の余白
      + "&bottom_margin=0.10" //下の余白
      + "&left_margin=0.25" //左の余白
      + "&horizontal_alignment=CENTER" //水平方向の位置
      + "&vertical_alignment=TOP" //垂直方向の位置
      + "&printtitle=false" //スプレッドシート名の表示有無
      + "&sheetnames=false" //シート名の表示有無
      + "&gridlines=false" //グリッドラインの表示有無
      + "&fzr=false" //固定行の表示有無
      + "&fzc=false" //固定列の表示有無;

    //PDFを作成するためのURL
    let url = baseUrl + pdfOptions;

    //アクセストークンを取得する
    let token = ScriptApp.getOAuthToken();

    //headersにアクセストークンを格納する
    let options = {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };

    //PDFを作成する
    let blob = UrlFetchApp.fetch(url, options).getBlob().setName(fileName + '.pdf');

    //PDFの保存先フォルダー
    //フォルダーIDは引数のfolderIdを使用します
    let folder = DriveApp.getFolderById(folderId);

    //PDFを指定したフォルダに保存する
    folder.createFile(blob);
  }
}


