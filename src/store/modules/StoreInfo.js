import * as types from "../types/info.js";
import AssetsApi from "@api/assets";

const StoreInfo = {
  namespaced: true,
  moduleName: "StoreInfo",
  state: {
    assetsList: [],
    queryParams: {
      hasNext: true,
      pageNum: 1,
    },
  },
  mutations: {
    [types.SET_ASSETS_LIST](state, payload) {
      state.assetsList = payload;
    },
    [types.SET_QUERY_PARAMS](state, payload) {
      state.queryParams = Object.assign({}, state.queryParams, payload);
    },
  },
  actions: {
    async getAssetsList({ state, commit }, { type }) {
      let res,
        pageNum = 1;
      if (type === "init") {
        res = await AssetsApi.getAssetsList(state.queryParams);
      } else {
        const queryParams = state.queryParams;
        if (type === "prev") {
          if (queryParams.pageNum === 1) return;
          pageNum = queryParams.pageNum - 1;
          res = await AssetsApi.getAssetsList({
            pageNum,
          });
        }
        if (type === "next") {
          if (!queryParams.hasNext) return;
          pageNum = queryParams.pageNum + 1;
          res = await AssetsApi.getAssetsList({
            pageNum,
          });
        }
      }
      if (res.code == 200) {
        let k;
        if (res.data && res.data.length) {
          k = res.data.map((d, i) => {
            return {
              sort: i,
              ...d,
            };
          });
        }
        commit(types.SET_ASSETS_LIST, k);
        commit(types.SET_QUERY_PARAMS, {
          pageNum: pageNum,
          hasNext: res.hasNext,
        });
      }
    },
  },
};

export default StoreInfo;
