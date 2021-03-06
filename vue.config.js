const path = require("path");
const devServer = require("./src/scripts/devServer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// https://staven630.github.io/vue-cli4-config/
function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: true,
  devServer: {
    ...devServer(),
  },

  chainWebpack: (config) => {
    // alias
    config.resolve.alias
      .set("@src", resolve("src"))
      .set("@utils", resolve("src/utils"))
      .set("@components", resolve("src/components"))
      .set("@StarUI", resolve("src/StarUI"))
      .set("@api", resolve("src/api"))
      .set("@router", resolve("src/router"))
      .set("@utils", resolve("src/utils"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"))
      .set("@styles", resolve("src/styles"))
      .set("@mixins", resolve("src/mixins"))
      .set("@wallet", resolve("src/wallet"))
      .set("@i18n", resolve("src/i18n"))
      .set("@constants", resolve("src/constants"));

    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    // image
    config.module
      .rule("images")
      .exclude.add(resolve("src/icons"))
      .end()
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: true },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 },
      });
    // webpack-bundle-analyzer
    if (isProduction) {
      // config
      //   .plugin("webpack-bundle-analyzer")
      //   .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
      // lodash
      config.plugin("loadshReplace").use(new LodashModuleReplacementPlugin());
    }
  },
  configureWebpack: (config) => {
    config.output.filename = `js/[name].[hash].js`;
    config.output.chunkFilename = `js/[name].[hash].js`;
    if (isProduction) {
      return {
        // externals: {
        //   vue: "vue",
        //   "vue-router": "VueRouter",
        //   axios: "axios",
        //   vuex: "vuex",
        // },
        plugins: [
          new CompressionWebpackPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240, // ????????????????????????????????????????????? 10240
            minRatio: 0.8, // ??????????????????????????????????????????????????????
          }),
          new UglifyJsPlugin({
            uglifyOptions: {
              //????????????????????????console
              compress: {
                drop_debugger: true,
                drop_console: true,
                dead_code: true,
                pure_funcs: ["console.log"], //??????console
              },
            },
            sourceMap: false,
            parallel: true,
          }),
        ],
      };
    } else {
      return {
        plugins: [new ImageminWebpWebpackPlugin()],
      };
    }
  },
  css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {
      scss: {
        prependData: `
        @import "@styles/variables.scss";
        `,
      },
      css: {
        modules: {
          mode: "local",
          localIdentName: "hpw__[hash:base64:8]",
        },
      },
    },
    requireModuleExtension: true,
  },
};
