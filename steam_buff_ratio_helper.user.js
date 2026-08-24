// ==UserScript==
// @name         Steam 挂刀比例助手（BUFF CSV）
// @namespace    https://chatgpt.com/
// @version      0.1.2
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
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
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

  const SOURCE_URL = 'https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/payload/v0.1.2/source.gz.b64';
  const EXPECTED_SHA256 = '2ec54945973a08521198ed4b6464e3c0c25627f86dc39ad92b393f52a564dc74';
  const CACHE_KEY = `sbrh:verified-source:${EXPECTED_SHA256}`;
  const ERROR_NOTICE_KEY = `sbrh:error-notice:${EXPECTED_SHA256}`;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function requestTextOnce(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 15000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(res.responseText.trim());
            return;
          }
          const error = new Error(`HTTP ${res.status}: ${url}`);
          error.status = res.status;
          reject(error);
        },
        onerror: () => reject(new Error(`网络请求失败: ${url}`)),
        ontimeout: () => reject(new Error(`请求超时: ${url}`)),
      });
    });
  }

  async function requestText(url, attempts = 3) {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await requestTextOnce(url);
      } catch (error) {
        lastError = error;
        const retryable = !error.status || error.status === 429 || error.status >= 500;
        if (!retryable || attempt === attempts) break;
        await sleep(500 * 2 ** (attempt - 1));
      }
    }
    throw lastError;
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
    return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
  }

  async function readVerifiedCache() {
    const cached = await GM_getValue(CACHE_KEY, '');
    if (!cached) return '';
    if (await sha256(cached) === EXPECTED_SHA256) return cached;
    await GM_deleteValue(CACHE_KEY);
    return '';
  }

  async function fetchVerifiedSource() {
    const encoded = await requestText(SOURCE_URL);
    const source = await gunzip(fromBase64(encoded));
    const actualHash = await sha256(source);
    if (actualHash !== EXPECTED_SHA256) {
      throw new Error(`脚本完整性校验失败：${actualHash}`);
    }
    await GM_setValue(CACHE_KEY, source);
    return source;
  }

  try {
    const cachedSource = await readVerifiedCache();
    const source = cachedSource || await fetchVerifiedSource();
    await GM_deleteValue(ERROR_NOTICE_KEY);
    // v0.2 计划改为单文件、无运行时远程加载的可审计构建产物。
    // eslint-disable-next-line no-eval
    eval(source);
  } catch (error) {
    console.error('[挂刀助手] 启动失败', error);
    const alreadyNotified = await GM_getValue(ERROR_NOTICE_KEY, false);
    if (!alreadyNotified) {
      await GM_setValue(ERROR_NOTICE_KEY, true);
      alert(`Steam 挂刀比例助手启动失败：\n${error?.message || error}`);
    }
  }
})();
