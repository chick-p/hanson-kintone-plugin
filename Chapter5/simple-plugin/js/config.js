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

  // Current Weather API の情報
  const weatherApiInfo = {
    url: 'https://api.openweathermap.org/data/2.5/weather',
    method: 'GET'
  };

  // 秘匿情報を保存するを使って保存された値を設定画面に表示する
  const proxyConfig = kintone.plugin.app.getProxyConfig(weatherApiInfo.url, weatherApiInfo.method);
  const apiTokenTextbox = document.querySelector('.js-token');
  if (proxyConfig?.data?.appid) {
    apiTokenTextbox.value = proxyConfig.data.appid;
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

    const apiToken = escapeHtml(apiTokenTextbox.value);
    const apiTokenAlert = document.querySelector('.js-token-alert');
    if (apiToken === '') {
      apiTokenAlert.classList.remove('js-hidden');
      return;
    }
    apiTokenAlert.classList.add('js-hidden');

    // Current Weather API の情報を保存する
    const successCallback = () => {
      const newConfig = {
        message,
        messageShownSpace,
      };
      kintone.plugin.app.setConfig(newConfig, () => {
        // アプリの設定画面に遷移する
        window.location.href = `/k/admin/app/flow?app=${appId}`;
      });
    };
    const headers = {};
    const body = {
      appid: apiToken
    };
    kintone.plugin.app.setProxyConfig(weatherApiInfo.url, weatherApiInfo.method, headers, body, successCallback);
  });
})(kintone.$PLUGIN_ID);
