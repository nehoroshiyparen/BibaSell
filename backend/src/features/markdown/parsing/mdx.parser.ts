import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { pathToFileURL } from 'node:url';

export async function MdxParser(mdxContent: string) {
  // Если у тебя есть путь (файл), лучше передать {path, value}, иначе можно передать {value}
  // baseUrl помогает корректно разрешать import / import.meta.url внутри MDX.
  const baseUrl = pathToFileURL(process.cwd() + '/').toString(); // или import.meta.url если вызов из модуля

  // evaluate компилирует + выполняет MDX, принимает runtime как набор значений (jsx helpers)
  const mdxModule = await evaluate(
    { value: mdxContent },           // можно передать { path, value } если есть реальный файл
    { ...runtime, baseUrl }         // runtime + опции (development, remarkPlugins и т.д.)
  );

  const MDXContent = mdxModule.default;
  if (!MDXContent) throw new Error('MDX compile/evaluate returned no default export');

  // Теперь рендерим как обычный React-компонент
  const html = renderToString(
    React.createElement(MDXContent as any, {
      components: {} // передай свои компоненты, если нужно
    })
  );

  return html;
}