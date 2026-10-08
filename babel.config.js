module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          // No web o Metro resolve o zustand pelo build ESM, que usa import.meta
          // e quebra o bundle ("Cannot use 'import.meta' outside a module").
          // O polyfill troca import.meta por um registro global e o app sobe.
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: ["nativewind/babel"],
  };
};
