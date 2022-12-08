'use strict'

class Dialog {
  static showDialog(title, prompt) {
    const ui = SpreadsheetApp.getUi();
    const response = ui.prompt(title, prompt, ui.ButtonSet.OK_CANCEL);
    const resBtn = response.getSelectedButton(); // クリックされたボタンの取得
    const resPrompt = response.getResponseText(); 
    if (resBtn != 'OK') {
      return null; //'OK'ボタン以外の操作の場合null値を返す
    } else {
      return resPrompt; //'OK'ボタンが押された場合は、入力されたテキスト返を取得する
    }
  }
}
