/**
 * plugins/webfontloader.ts
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */ "webfontloader"
  );

  webFontLoader.load({
    custom: {
      families: ["SCoreDream"],
      urls: ["https://webfontworld.github.io/score/SCoreDream.css"],
    },
  });
}
