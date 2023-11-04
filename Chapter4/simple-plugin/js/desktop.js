((PLUGIN_ID) => {
  'use strict';

  // プラグインの設定情報を取得する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) {
    return;
  }
  const {message, messageShownSpace} = config;

  kintone.events.on('app.record.detail.show', (event) => {

    // メッセージを表示する要素を作成する
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('sample-plugin-message');
    messageDiv.textContent = message;

    // スペースフィールドを取得する
    const spaceField = kintone.app.record.getSpaceElement(messageShownSpace);

    // スペースフィールドに、メッセージを表示する要素を追加する
    spaceField.appendChild(messageDiv);

    return event;
  });

})(kintone.$PLUGIN_ID);
