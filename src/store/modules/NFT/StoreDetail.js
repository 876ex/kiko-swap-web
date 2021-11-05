import * as types from "../../types/NFT/detail.js";
import boxDetailsApi from "@api/nft/details";

const StoreNFTDetail = {
  namespaced: true,
  moduleName: "StoreCommon",
  state: {
    // 当前选中的详情页横向tab
    selected_cross_tab: "",
    // 合约地址
    contract_address: "",
    // 最大可出售价
    max_sell_price: "",
    // 出售价格
    sell_price_input: "",
    // 币种精度
    exchangePrecision: "",
    // 出售选择币种
    sell_currency: "STC",
    // NFT Box 详情
    nft_box_detail: [],
    // 历史记录
    box_history_list: [],
  },

  mutations: {
    [types.SET_CROSS_TAB](state, selected_cross_tab) {
      state.selected_cross_tab = selected_cross_tab;
    },
    [types.CONTRACT_ADDRESS](state, contract_address) {
      state.contract_address =
        contract_address.slice(0, 6) + "..." + contract_address.slice(-4);
    },
    [types.MAX_SELL_PRICE](state, max_sell_price) {
      state.max_sell_price = max_sell_price;
    },
    [types.SELL_PRICE_INPUT](state, sell_price_input) {
      state.sell_price_input = sell_price_input;
    },
    [types.EXCHANGE_PRECISION](state, exchangePrecision) {
      state.exchangePrecision = exchangePrecision;
    },
    [types.SELL_CURRENCY](state, sell_currency) {
      state.sell_currency = sell_currency;
    },
    [types.SET_NFT_BOX_DETAILS_DATA](state, data) {
      state.nft_box_detail = data;
    },
    [types.SET_NFT_DETAIL_PARAMS](state, id) {
      state.nft_info_id = id;
    },
    [types.SET_BOX_HISTORY_LIST](state, list) {
      state.box_history_list = list;
    },
  },
  actions: {
    async getNFTBoxDetail({ commit }, id) {
      let res = await boxDetailsApi.getNFTBoxDetail(id);
      if (res.code === 200) {
        commit(types.SET_NFT_BOX_DETAILS_DATA, res.data);
      }
    },
  },
};

export default StoreNFTDetail;
