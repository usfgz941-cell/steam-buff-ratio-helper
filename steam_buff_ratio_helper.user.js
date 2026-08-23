// ==UserScript==
// @name         Steam 挂刀比例助手（BUFF CSV）
// @namespace    https://chatgpt.com/
// @version      0.1.0
// @description  导入 BUFF 购买记录，在 Steam 出售框实时显示实际挂刀比例，并按卖盘深度与近期成交给出快速/均衡/耐心挂价建议。
// @author       OpenAI
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/market*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      bank.gov.ua
// @connect      steamcommunity.com
// @homepageURL  https://github.com/usfgz941-cell/steam-buff-ratio-helper
// @supportURL   https://github.com/usfgz941-cell/steam-buff-ratio-helper/issues
// @downloadURL  https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/steam_buff_ratio_helper.user.js
// @updateURL    https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/steam_buff_ratio_helper.user.js
// @license      MIT
// ==/UserScript==

(async () => {
  'use strict';

  const BASE = 'https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/payload';
  const PARTS = 7;
  const EXPECTED_SHA256 = 'da7f5b9f303fd700e61fee5c2b7999ffa38b379f5219fe54922209de3dfb9a74';

  function requestText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 15000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) resolve(res.responseText.trim());
          else reject(new Error(`HTTP ${res.status}: ${url}`));
        },
        onerror: () => reject(new Error(`网络请求失败: ${url}`)),
        ontimeout: () => reject(new Error(`请求超时: ${url}`)),
      });
    });
  }

  function fromBase64(text) {
    const binary = atob(text);
    return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  }

  async function gunzip(bytes) {
    if (typeof DecompressionStream !== 'function') {
      throw new Error('当前浏览器不支持 DecompressionStream，请使用新版 Edge / Chrome');
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Response(stream).text();
  }

  async function sha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map((v) => v.toString(16).padStart(2, '0')).join('');
  }

  try {
    const urls = Array.from({ length: PARTS }, (_, i) => `${BASE}/part-${String(i + 1).padStart(2, '0')}.txt`);
    const chunks = await Promise.all(urls.map(requestText));
    const source = await gunzip(fromBase64(chunks.join('')));
    const actualHash = await sha256(source);
    if (actualHash !== EXPECTED_SHA256) {
      throw new Error(`脚本完整性校验失败：${actualHash}`);
    }
    // eslint-disable-next-line no-eval
    eval(source);
  } catch (error) {
    console.error('[挂刀助手] 启动失败', error);
    alert(`Steam 挂刀比例助手启动失败：\n${error?.message || error}`);
  }
})();
