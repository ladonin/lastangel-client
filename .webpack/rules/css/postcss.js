const PostCSSAutoprefixer = require('autoprefixer');
const PostCSSURL = require('postcss-url');
const PostCSSPresetEnv = require('postcss-preset-env');
const PostCSSFlexBugsFixes = require('postcss-flexbugs-fixes');
const PostCSSNano = require('cssnano');

/**
 * Базовые PostCSS Плагины, используются в DEVELOPMENT режиме
 * @field PostCSSFlexBugsFixes - модифицирует Flexbox, чтобы он работал с учётом багов некоторых браузеров.
 * Список багов - https://github.com/philipwalton/flexbugs
 * @field PostCSSPresetEnv - полифилы CSS для всех браузеров
 * @field PostCSSURL - Позволяет работать с url в стилях более свободно
 * @field PostCSSAutoprefixer - Автоматическое добавление префиксов вендоров
 */
const basePostCSSPlugins = [PostCSSFlexBugsFixes(), PostCSSPresetEnv({
    browsers: 'last 2 versions',
}), PostCSSURL, PostCSSAutoprefixer()];

/**
 * Расширенные PostCSS Плагины, используются в PRODUCTION режиме.
 * Включают базовые плагины.
 * @field PostCSSNano - минификация CSS
 */
const extendedPostCSSPlugins = basePostCSSPlugins.concat(PostCSSNano());

module.exports = {
    basePostCSSPlugins,
    extendedPostCSSPlugins,
};
