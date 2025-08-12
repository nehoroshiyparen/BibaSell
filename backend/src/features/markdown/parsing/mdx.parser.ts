import { compile } from "@mdx-js/mdx";
import { renderToString } from "react-dom/server";
import React from "react";

export async function MdxParser(mdxContent: string) {
    // Компилируем MDX в ES-модуль с функцией React-компонента
    const compiled = await compile(mdxContent, {
      outputFormat: "program",          // полноценный ES-модуль
      development: false,               // для продакшна — false
      jsxRuntime: "automatic",          // использовать jsx-runtime (React 17+)
    });

    // Конвертируем код в data-url для динамического импорта
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(String(compiled)).toString("base64")}`;

    // Динамически импортируем модуль с React-компонентом MDX
    const { default: MdxComponent } = await import(moduleUrl);

    if (!MdxComponent) {
      throw new Error("MDX content missing default export");
    }

    // Рендерим React-компонент в строку
    const html = renderToString(
      React.createElement(MdxComponent, {
        components: {
          // здесь можно передавать кастомные MDX-компоненты, если нужны
        },
      })
    );

    return html;
}