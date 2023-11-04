((PLUGIN_ID) => {
  'use strict';

  // XSS を防ぐためのエスケープ処理
  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '&#xA;');
  };

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  // プラグイン設定に保存された値を、設定画面に表示する
  const messageTextbox = document.querySelector('.js-message');
  if (config.message) {
    messageTextbox.value = config.message;
  }

  const appId = kintone.app.getId();

  const cancelButton = document.querySelector('.js-button-cancel');
  cancelButton.addEventListener('click', () => {
    // プラグイン一覧画面に遷移する
    window.location.href = `/k/admin/app/${appId}/plugin/`;
  });

  const saveButton = document.querySelector('.js-button-save');
  saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = escapeHtml(messageTextbox.value);
    const messageAlert = document.querySelector('.js-message-alert');
    if (message === '') {
      messageAlert.classList.remove('js-hidden');
    } else {
      messageAlert.classList.add('js-hidden');
      const newConfig = {
        message,
      };
      kintone.plugin.app.setConfig(newConfig, () => {
        // アプリの設定画面に遷移する
        window.location.href = `/k/admin/app/flow?app=${appId}`;
      });
    }
  });

})(kintone.$PLUGIN_ID);
