import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import vm from 'node:vm';

function fail(message) {
  console.error(`\n[verify-dist] ${message}`);
  process.exit(1);
}

const loaderPath = 'steam_buff_ratio_helper.user.js';
if (!existsSync(loaderPath)) fail(`${loaderPath} 不存在`);

const loader = readFileSync(loaderPath, 'utf8');
const partCountMatch = loader.match(/const\s+PARTS\s*=\s*(\d+)/);
const expectedHashMatch = loader.match(/const\s+EXPECTED_SHA256\s*=\s*['"]([a-f0-9]{64})['"]/i);
const loaderVersionMatch = loader.match(/^\/\/\s*@version\s+([^\s]+)$/m);

if (!partCountMatch) fail('安装脚本中找不到 PARTS');
if (!expectedHashMatch) fail('安装脚本中找不到 EXPECTED_SHA256');
if (!loaderVersionMatch) fail('安装脚本中找不到 @version');

const partCount = Number(partCountMatch[1]);
const expectedHash = expectedHashMatch[1].toLowerCase();
const files = readdirSync('payload')
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort();

if (files.length !== partCount) {
  fail(`payload 分片数不一致：安装脚本声明 ${partCount}，仓库实际 ${files.length}`);
}

const encoded = files.map((name) => readFileSync(`payload/${name}`, 'utf8').trim()).join('');
let source;
try {
  source = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
} catch (error) {
  fail(`payload 无法解压：${error.message}`);
}

const actualHash = createHash('sha256').update(source).digest('hex');
if (actualHash !== expectedHash) {
  fail(`payload SHA-256 不一致：expected=${expectedHash}, actual=${actualHash}`);
}

try {
  new vm.Script(source, { filename: 'decoded-userscript.js' });
} catch (error) {
  fail(`解压后的源码语法错误：${error.message}`);
}

const forbiddenPatterns = [
  /7656119\d{10}/,
  /U\d{6,}_\d{8}_\d{8}_buy_normal\.csv/i,
  /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/,
  /@connect\s+\*/,
  /@grant\s+GM_cookie/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(loader) || pattern.test(source)) {
    fail(`发现不应进入公开发行包的内容：${pattern}`);
  }
}

const sourceVersion = source.match(/^\/\/\s*@version\s+([^\s]+)$/m)?.[1] ?? 'unknown';
console.log(JSON.stringify({
  ok: true,
  loaderVersion: loaderVersionMatch[1],
  sourceVersion,
  payloadParts: files.length,
  sourceBytes: Buffer.byteLength(source),
  sha256: actualHash,
}, null, 2));
