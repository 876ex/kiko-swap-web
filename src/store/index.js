import { createStore, createLogger } from "vuex";
import StoreCommon from "./modules/StoreCommon";
import StoreApp from "./modules/StoreApp";
import StoreSwap from "./modules/StoreSwap";
import StoreWallet from "./modules/StoreWallet";
import StoreLiquidity from "./modules/StoreLiquidity";
import StoreNFTDetail from "./modules/NFT/StoreDetail";
import StoreBlindBox from "./modules/NFT/StoreBlindBox";
import StoreNftMarket from "./modules/NFT/StoreMarket";
import StoreCollection from "./modules/NFT/StoreCollection";
import StoreBuyBack from "./modules/NFT/StoreBuyBack";
import StoreInfo from "./modules/StoreInfo"; // 行情
const debug = process.env.NODE_ENV !== "production";
export default createStore({
  modules: {
    StoreCommon,
    StoreApp,
    StoreSwap,
    StoreWallet,
    StoreLiquidity,
    StoreNFTDetail,
    StoreBlindBox,
    StoreNftMarket,
    StoreCollection,
    StoreBuyBack,
    StoreInfo,
    strict: debug,
    plugins: debug ? [createLogger()] : [],
  },
});
