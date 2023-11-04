/* globals KintoneConfigHelper */
(async (PLUGIN_ID) => {
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

  // スペースフィールドのセレクトボックスの項目を作成
  const createOptionsForSpaceField = async () => {
    // メッセージを表示するフィールドが設定されていないときの項目
    const unselectedOption = document.createElement('option');
    unselectedOption.value = '';
    unselectedOption.textContent = '選択してください';
    let options = [unselectedOption];

    // kintone-config-helper を使って、アプリ内のスペースフィールドを取得する
    const spaceFields =
      await KintoneConfigHelper.getFields('SPACER');
    spaceFields.forEach((field) => {
      const option = document.createElement('option');
      option.value = field.elementId;
      option.textContent = field.elementId;
      options = options.concat(option);
    });
    return options;
  };

  // スペースフィールドを選択するためのセレクトボックスを作成する
  const messageShownFieldSelect = document.querySelector(
    '.js-message-shown-field'
  );
  const spaceFieldOptions = await createOptionsForSpaceField();
  spaceFieldOptions.forEach((option) => {
    messageShownFieldSelect.appendChild(option);
  });

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  // プラグイン設定に保存された値を、設定画面に表示する
  const messageTextbox = document.querySelector('.js-message');
  if (config.message) {
    messageTextbox.value = config.message;
  }
  if (config.messageShownSpace) {
    // プラグイン設定に保存された値と同じオプション要素を選択状態にする
    const selectedOption = spaceFieldOptions.find(
      (option) => option.value === config.messageShownSpace
    );
    if (selectedOption) {
      selectedOption.selected = true;
    }
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
      return;
    }
    messageAlert.classList.add('js-hidden');

    const messageShownSpace = messageShownFieldSelect.value;
    const messageShownFieldAlert = document.querySelector(
      '.js-message-shown-field-alert'
    );
    if (messageShownSpace === '') {
      messageShownFieldAlert.classList.remove('js-hidden');
      return;
    }
    messageShownFieldAlert.classList.add('js-hidden');

    const newConfig = {
      message,
      messageShownSpace,
    };
    kintone.plugin.app.setConfig(newConfig, () => {
      // アプリの設定画面に遷移する
      window.location.href = `/k/admin/app/flow?app=${appId}`;
    });
  });
})(kintone.$PLUGIN_ID);
