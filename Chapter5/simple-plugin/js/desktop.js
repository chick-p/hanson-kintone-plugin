((PLUGIN_ID) => {
  'use strict';

  // プラグインの設定情報を取得する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) {
    return;
  }
  const {message, messageShownSpace} = config;

  kintone.events.on('app.record.detail.show', async (event) => {

    // Current Weather API の情報
    const baseUrl = 'https://api.openweathermap.org';
    const url = `${baseUrl}/data/2.5/weather?q=Tokyo,jp&units=metric`;
    const method = 'GET';
    const headers = {};
    const data = {};

    // Current Weather API へのリクエストを送信する
    const [bodyString, statusCode] = await kintone.plugin.app.proxy(PLUGIN_ID, url, method, headers, data);
    const body = JSON.parse(bodyString);
    // ステータスコードが 200 でない場合は、エラーをコンソールに出力する
    if (statusCode !== 200) {
      console.error(body);
    }
    const maxTemperature = body?.main?.temp_max || '不明';
    const notice = `今日の東京の最高気温は ${maxTemperature} です`;

    // メニューの上側の要素を取得して最高気温を表示する
    const headerSpace = kintone.app.record.getHeaderMenuSpaceElement();
    const noticeDiv = document.createElement('div');
    noticeDiv.classList.add('sample-plugin-message');
    noticeDiv.textContent = notice;
    headerSpace.appendChild(noticeDiv);

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
