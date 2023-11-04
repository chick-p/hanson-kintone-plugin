(() => {
  'use strict';

  kintone.events.on('app.record.detail.show', (event) => {

    // メッセージを表示する要素を作成する
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('sample-plugin-message');
    messageDiv.textContent = 'Hello kintone Plugin';

    // スペースフィールドを取得する
    const spaceField = kintone.app.record.getSpaceElement('message');

    // スペースフィールドに、メッセージを表示する要素を追加する
    spaceField.appendChild(messageDiv);

    return event;
  });
})();
