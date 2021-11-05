import commonApi from "@api/common";
import * as types from "../types/common.js";

const StoreCommon = {
  namespaced: true,
  moduleName: "StoreCommon",
  state: {
    currencyList: [],
    filterData: [],
  },
  mutations: {
    [types.SET_CURRENCY_LIST](state, data) {
      state.currencys = data;
    },
  },
  actions: {
    async getCurrencyList({ commit }) {
      let res = await commonApi.getCurrency();
      if (res.code === 200) {
        commit(types.SET_CURRENCY_LIST, res.data);
      }
    },
    /* eslint-disable-next-line */
    // async pollingTxnInfo({}, { hash }) {
    //   return new Promise((resolve) => {
    //     commonApi.getTransactionInfo(hash).then((res) => {
    //       if (res.result && res.result.status === "Executed") {
    //         resolve(res.result.status);
    //       } else {
    //         setTimeout(() => {
    //           resolve(pollingTxnInfo())
    //         }, )
    //       }
    //     });
    //   });
    // },
  },
};

export default StoreCommon;
