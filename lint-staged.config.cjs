/**
 * Правила для lint-staged
 * @desc Библиотека проверяет файлы, готовые к коммиту
 */

const { ESLint } = require("eslint");

/**
 * Удаление из проверки lint-staged файлов, которые находятся в .eslintignore
 * @param {string[]}files Имена файлов, находящиеся в stage гита
 */
const getFilesToLint = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(files.map((file) => eslint.isPathIgnored(file)));
  return files.filter((_, index) => !isIgnored[index]);
};

module.exports = {
  /**
   * Из всех файлов, готовых к коммиту, оставляем только файлы, подходящие под шаблон.
   * Проверяем их в eslint и форматируем в prettier.
   * В случае, если процесс запущен во время коммита, любая ошибка остановит коммит.
   * @param {string[]}filenames Имена файлов, находящиеся в stage гита
   */
  "src/**/*.{ts,tsx}": async (filenames) => {
    console.log(filenames)
    const filesToLint = await getFilesToLint(filenames);
    return [
      `eslint ${filesToLint.join(" ")} --rule "{no-console: 1, no-alert:2, no-debugger: 2}"`,
      `prettier ${filenames.join(" ")} --write`,
      "git add",
    ];
  },
};
