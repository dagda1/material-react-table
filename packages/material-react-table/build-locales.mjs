/* eslint-disable */
import fs from 'fs';
import { rolldown } from 'rolldown';

const supportedLocales = [
  'ar',
  'az',
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'es',
  'et',
  'fa',
  'fi',
  'fr',
  'he',
  'hr',
  'hu',
  'hy',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'no',
  'np',
  'pl',
  'pt',
  'pt-BR',
  'ro',
  'ru',
  'sk',
  'sr-Cyrl-RS',
  'sr-Latn-RS',
  'sv',
  'tr',
  'uk',
  'vi',
  'zh-Hans',
  'zh-Hant',
];

async function build(locale) {
  const bundle = await rolldown({
    input: `./src/locales/${locale}.ts`,
    platform: 'neutral',
  });

  await bundle.write({
    file: `./locales/${locale}/index.js`,
    format: 'cjs',
    sourcemap: false,
  });

  await bundle.write({
    file: `./locales/${locale}/index.mjs`,
    format: 'esm',
    sourcemap: false,
  });

  const typeFile = `import { type MRT_Localization } from '../..';
export declare const MRT_Localization_${locale
    .toUpperCase()
    .replaceAll('-', '_')}: MRT_Localization;
  `;

  await fs.writeFile(`./locales/${locale}/index.d.ts`, typeFile, (err) => {
    if (err) console.log(err);
  });

  await fs.writeFile(`./locales/${locale}/index.d.mts`, typeFile, (err) => {
    if (err) console.log(err);
  });

  await fs.writeFile(
    `./locales/${locale}/package.json`,
    JSON.stringify(
      {
        main: 'index.js',
        module: 'index.mjs',
        sideEffects: false,
        types: 'index.d.ts',
      },
      null,
      2,
    ),
    (err) => {
      if (err) console.log(err);
    },
  );

  console.log(`Built ${locale} locale`);
}

async function run() {
  fs.rmSync('./locales', { force: true, recursive: true });
  for (const locale of supportedLocales) {
    await build(locale);
  }
}

run().catch((error) => console.error(error));
