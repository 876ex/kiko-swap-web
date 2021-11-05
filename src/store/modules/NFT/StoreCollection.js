import * as types from "../../types/NFT/collection";

import collectionApi from "@/api/nft/collection";
import commonApi from "@/api/common";
import utilsTools from "@utils/tool";
import { cloneDeep } from "lodash";
import NFT_CONSTANTS from "@constants/nft.js";
import Wallet from "@wallet";
import utilsFormat from "@utils/format";

const StoreCollection = {
  namespaced: true,
  moduleName: "StoreCollection",
  state: {
    groupList: null,
    change_confirm_visible: false,
    show_rules: [true, true],
    unsold_nft_data: [],
    unsold_box_data: [],
    detail_info: null,
    detail_type: null,
    sellingData: null,
    isLoading: true,
    purchaseData: [],
    sellRecordData: [],
    dialogParams: NFT_CONSTANTS.INIT_DIALOG_PARAMS,
    secondDialogParams: NFT_CONSTANTS.INIT_SECOND_DIALOG_PARAMS,
    soldDialogParams: NFT_CONSTANTS.INIT_SOLD_DIALOG_PARAMS,
    onSellIsLoading: false,
    purchaseQuery: {
      pageNum: 0,
      hasNext: true,
    },
    sellQuery: {
      pageNum: 0,
      hasNext: true,
    },
  },
  mutations: {
    [types.CHANGE_SOLD_DIALOG_PARAMS](state, payload) {
      state.soldDialogParams = Object.assign(
        {},
        state.soldDialogParams,
        payload
      );
    },
    [types.CHANGE_ON_SELL_IS_LOADING](state, payload) {
      state.onSellIsLoading = payload;
    },
    [types.SET_SALE_HISTORY_QUERY](state, payload) {
      state.sellQuery = payload;
    },
    [types.SET_PURCHASE_HISTORY_QUERY](state, payload) {
      state.purchaseQuery = payload;
    },
    [types.SET_SALE_HISTORY_DATA](state, payload) {
      const { data } = payload;
      state.sellRecordData = data;
      state.isLoading = false;
    },
    [types.SET_PURCHASE_HISTORY_DATA](state, payload) {
      const { data } = payload;
      state.purchaseData = data;
      state.isLoading = false;
    },
    [types.SET_SELLING_DATA](state, payload) {
      state.sellingData = payload;
      state.onSellIsLoading = false;
    },
    [types.SET_LOADING_STATUS](state, payload) {
      state.isLoading = payload;
    },
    [types.SET_DETAIL_TYPE](state, payload) {
      state.detail_type = payload;
    },
    [types.SET_DETAIL_INFO](state, payload) {
      state.detail_info = payload;
    },
    [types.SET_SHOW_RULES](state, payload) {
      state.show_rules = payload;
    },
    [types.SET_UNSOLD_NFT_DATA](state, data) {
      state.unsold_nft_data = data;
    },

    [types.SET_UNSOLD_BOX_DATA](state, data) {
      if (data && data.length) {
        state.unsold_box_data = state.unsold_box_data.concat(data);
      } else {
        state.unsold_box_data = [];
      }
    },
    [types.CHANGE_DIALOG_STATUS](state, payload) {
      state.dialogParams = Object.assign({}, state.dialogParams, payload);
    },
    [types.CHANGE_SECOND_DIALOG_STATUS](state, payload) {
      state.secondDialogParams = Object.assign(
        {},
        state.secondDialogParams,
        payload
      );
    },
  },
  getters: {
    selling_data: (state) => {
      const rules = state.show_rules;
      let list = cloneDeep(state.sellingData || []);
      if (list && list.length > 0) {
        if (rules[0] && !rules[1]) {
          list = list.filter((d) => d.type === "box");
        }
        if (!rules[0] && rules[1]) {
          list = list.filter((d) => d.type === "nft");
        }
        if (!rules[0] && !rules[1]) {
          list = [];
        }
      }
      console.log("selling_data", list);
      return list;
    },
    unsold_data: (state) => {
      const reverseArr = cloneDeep(state.unsold_box_data).reverse();
      let list = [...state.unsold_nft_data, ...reverseArr];
      const rules = state.show_rules;
      if (rules[0] && !rules[1]) {
        // 只要box
        list = list.filter((d) => d.nft === false);
      }
      if (!rules[0] && rules[1]) {
        list = list.filter((d) => d.nft === true);
      }
      if (!rules[0] && !rules[1]) {
        list = [];
      }
      return list;
    },
    tab_list(state) {
      const list = [...state.unsold_nft_data, ...state.unsold_box_data];
      let len = list.length;
      return [
        {
          name: "未出售",
          num: len,
          key: 1,
          showCount: true,
        },
        {
          name: "销售中",
          num: (state.sellingData && state.sellingData.length) || 0,
          key: 2,
          showCount: true,
        },
        {
          name: "购买记录",
          key: 3,
          showCount: false,
        },
        {
          name: "出售记录",
          key: 4,
          showCount: false,
        },
      ];
    },
  },
  actions: {
    //获取未出售盲盒详情
    async getBoxDetail({ commit }, payload) {
      let res = await collectionApi.getBoxDetail(
        payload.boxToken,
        payload.payToken
      );
      if (res.code === 200) {
        if (payload.type === "list") {
          let bidData = {
            id: res.data.id,
            icon: res.data.boxTokenLogo,
            name: res.data.name,
            nftBody: res.data.nftBody,
            nftMeta: res.data.nftMeta,
            nft: false,
            sellType: "",
            type: "box",
            boxToken: payload.boxToken,
            address: res.data.boxToken,
            payToken: payload.payToken,
          };
          let list = [];
          if (payload.count > 1) {
            for (let i = 0; i < payload.count; i++) {
              list.push(bidData);
            }
          }
          if (list && list.length) {
            commit(types.SET_UNSOLD_BOX_DATA, list);
          } else {
            commit(types.SET_UNSOLD_BOX_DATA, [bidData]);
          }
        } else if (payload.type === "detail") {
          commit(types.SET_DETAIL_INFO, res.data);
          commit(types.SET_DETAIL_TYPE, "box");
        }
      }
    },

    //未出售盲盒
    /* eslint-disable-next-line*/
    async getUnsoldBID({}, payload) {
      let list = [];
      if (payload.resourceList) {
        for (const [k, v] of Object.entries(payload.resourceList)) {
          payload.data.map((item) => {
            // 这里大小写问题
            // 下一期需要把大小写匹配忽略
            let matchString = item.boxToken.replace("::KikoCatBox", "");
            let boxToken = k.match(matchString);
            if (boxToken) {
              if (v.json.token) {
                list.push({
                  boxToken: boxToken[0] + "::KikoCatBox",
                  amount: String(v.json.token.value),
                  payToken: item.payToken,
                });
              }
            }
          });
        }
        return list;
      }
    },
    //未出售NFT
    /* eslint-disable-next-line*/
    async getUnsoldNft({}, payload) {
      let list = [];
      if (payload.resourceList) {
        for (let [k, v] of Object.entries(payload.resourceList)) {
          payload.data.map((item) => {
            let matchString = `${item.nftMeta}, ${item.nftBody}`;
            if (k.includes(matchString)) {
              const items = v.json.items;
              items.map(async (d) => {
                let obj = {
                  icon: utilsTools.hexCharCodeToStr(d["base_meta"]["image"]),
                  name: utilsTools.hexCharCodeToStr(d["base_meta"]["name"]),
                  address: k,
                  nftId: d.id,
                  nftMeta: item.nftMeta,
                  nftBody: item.nftBody,
                  id: d.id,
                  nft: true,
                  sellType: "",
                  payToken: item.payToken,
                  type: "nft",
                  isUnSoldNft: true,
                };
                list.push(obj);
              });
            }
          });
        }
        return list;
      }
      return [];
    },
    //未出售nft详情
    async getNftDetail({ commit }, payload) {
      const res = await collectionApi.getNftDetail(
        payload.nftMeta,
        payload.nftBody,
        payload.nftId,
        payload.payToken
      );
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "nft");
      }
    },
    async groupList({ commit, dispatch }, payload) {
      commit(types.SET_LOADING_STATUS, true);
      console.time("===collection api request===");
      console.time("===collection contracts===");
      Promise.allSettled([
        collectionApi.groupList(),
        commonApi.getUserResourceList(payload),
      ]).then(async ([resGroupList, resResourceList]) => {
        if (
          resGroupList.status === "fulfilled" &&
          resGroupList.value.code === 200 &&
          resResourceList.status === "fulfilled" &&
          resResourceList.value.result
        ) {
          console.timeEnd("===collection contracts===");
          const resourceList = resResourceList.value.result.resources;
          const resNFT = await dispatch("getUnsoldNft", {
            userAddress: payload,
            data: resGroupList.value.data,
            resourceList,
          });
          console.log("resNFT", resNFT);
          if (resNFT && resNFT.length > 0) {
            commit(types.SET_UNSOLD_NFT_DATA, resNFT.reverse());
            commit(types.SET_LOADING_STATUS, false);
          }
          const resBlindBox = await dispatch("getUnsoldBID", {
            userAddress: payload,
            data: resGroupList.value.data,
            resourceList,
          });
          if (resBlindBox && resBlindBox.length > 0) {
            resBlindBox.map(async (item) => {
              console.log("resBlindBox=>item.amount", item.amount);
              if (Number(item.amount) > 0) {
                console.time("===box detail===");
                await dispatch("getBoxDetail", {
                  boxToken: item.boxToken,
                  payToken: item.payToken,
                  count: item.amount,
                  type: "list",
                });
                commit(types.SET_LOADING_STATUS, false);
                console.timeEnd("===box detail===");
              }
            });
          }
          console.log("resBlindBox", resBlindBox);
          setTimeout(() => {
            commit(types.SET_LOADING_STATUS, false);
          }, 1500);
        }
        console.timeEnd("===collection api request===");
      });
    },
    //获取出售中的列表
    async getSellingData({ commit }, userAddress) {
      commit(types.CHANGE_ON_SELL_IS_LOADING, true);
      const res = await collectionApi.getSellingData(userAddress);
      if (res.code === 200) {
        if (res.data && res.data.length) {
          res.data.reverse();
        }
        commit(types.SET_SELLING_DATA, res.data);
      }
    },
    //出售中盲盒详情
    //出售中nft详情
    async getSellingNftDetail({ commit }, infoId) {
      const res = await collectionApi.getSellingNftDetail(infoId);
      if (res.code === 200) {
        // const t = Object.assign({}, res.data, { onSell: false });
        // console.log("t", t);
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "nft");
      }
    },
    async getSellingBoxDetail({ commit }, payload) {
      const res = await collectionApi.getSellingBoxDetail(
        payload.groupId,
        payload.chainId
      );
      if (res.code === 200) {
        commit(types.SET_DETAIL_INFO, res.data);
        commit(types.SET_DETAIL_TYPE, "box");
      }
    },
    async getPurchaseHistory({ commit, state }, payload) {
      let pageNum = 1;
      if (payload.type === "change") {
        commit(types.SET_PURCHASE_HISTORY_QUERY, {
          pageNum,
        });
      } else if (payload.type === "click") {
        pageNum = state.purchaseQuery.pageNum;
        if (payload.direction === "prev") {
          if (pageNum <= 1) return;
          pageNum = pageNum - 1;
        }
        if (payload.direction === "next") {
          if (!state.purchaseQuery.hasNext) return;

          pageNum = pageNum + 1;
        }
      }
      const res = await collectionApi.getPurchaseHistory({
        address: payload.address,
        pageNum,
      });
      if (res.code === 200) {
        commit(types.SET_PURCHASE_HISTORY_DATA, {
          data: res.data,
        });
        commit(types.SET_PURCHASE_HISTORY_QUERY, {
          hasNext: res.hasNext,
          pageNum,
        });
      }
    },
    async getSalesHistory({ commit, state }, payload) {
      let pageNum = 1;
      if (payload.type === "change") {
        commit(types.SET_SALE_HISTORY_QUERY, {
          pageNum,
        });
      } else if (payload.type === "click") {
        pageNum = state.sellQuery.pageNum;
        if (payload.direction === "prev") {
          if (pageNum <= 1) return;
          pageNum = pageNum - 1;
        }
        if (payload.direction === "next") {
          if (!state.sellQuery.hasNext) return;
          pageNum = pageNum + 1;
        }
      }
      const res = await collectionApi.getSalesHistory({
        address: payload.address,
        pageNum,
      });
      if (res.code === 200) {
        commit(types.SET_SALE_HISTORY_DATA, {
          data: res.data,
        });
        commit(types.SET_SALE_HISTORY_QUERY, {
          hasNext: res.hasNext,
          pageNum,
        });
      }
    },
    /* eslint-disable-next-line*/
    async getSellBoxIdByHash({}, payload) {
      const res = await collectionApi.getSellBoxIdByHash(payload.txnHash);
      console.log("getBlindBoxIdByTxnHash", res);
      if (res.result && res.result.length > 0) {
        const k = res.result.filter((d) =>
          d.type_tag.includes(payload.boxToken)
        );
        if (k && k.length) {
          const id = k[0].decode_event_data.id;
          return String(id);
        }
      }
    },
    /* eslint-disable */
    async openBlindBoxCall({ rootState, commit, dispatch }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("开启中"),
      });
      const boxTokenArr = payload.boxTokenArr;
      const params = {
        provider: rootState.StoreWallet.stcProvider,
        blindboxId: `${boxTokenArr[0]}::${boxTokenArr[1]}`,
        type: "OPEN",
      };
      const txnHash = await Wallet.openBlindBox(params);
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        let timer = null;
        timer = setInterval(async () => {
          console.count("定时器查询次数");
          console.time("===collection查询boxId===");
          let id = await dispatch("getSellBoxIdByHash", {
            txnHash,
            boxToken: `${boxTokenArr[0]}::${boxTokenArr[1]}::BoxOpenEvent`,
          });
          console.timeEnd("===collection查询boxId===");
          if (id) {
            console.timeEnd("===获取ID===");
            clearInterval(timer);
            console.time("===查询NFT===");
            const nftInfo = await collectionApi.getNftDetail(
              payload.nftMeta,
              payload.nftBody,
              id
            );
            if (nftInfo.code === 200) {
              console.log("nftInfo.data.", nftInfo.data);
              commit(types.CHANGE_DIALOG_STATUS, {
                phase2: "success",
              });
              // 原因是图片load太慢
              // 先给个展位图
              setTimeout(() => {
                commit(types.CHANGE_DIALOG_STATUS, {
                  title:
                    utilsFormat.computedLangCtx("获得") +
                    " " +
                    nftInfo.data.name,
                  // TODO
                  // 用个展位图
                  customImgUrl: "   ", //
                  dialogStatus: "success",
                  dialogText: "",
                  successBtnText: utilsFormat.computedLangCtx("去我的NFT查看"),
                  isBlindBox: false,
                });
              }, 500);

              setTimeout(() => {
                commit(types.CHANGE_DIALOG_STATUS, {
                  customImgUrl: nftInfo.data.imageLink,
                });
              }, 2000);
              // setTimeout(() => {
              //   commit(types.CHANGE_DIALOG_STATUS, {
              //     title: utilsFormat.computedLangCtx("获得") + " " + nftInfo.data.name,
              //     dialogText: "",
              //     customImgUrl: nftInfo.data.imageLink,
              //     dialogStatus: "success",
              //     successBtnText: utilsFormat.computedLangCtx("去我的NFT查看"),
              //   });
              // }, 5000);
              console.timeEnd("===查询NFT===");
              console.timeEnd("===盲盒开启===");
            }
          }
        }, 1000);
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("开启失败"),
          customImgUrl: "",
        });
      }
    },
    async sellContractsCall({ rootState, commit, state }, payload) {
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("上架中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "SELL",
        }
      );
      console.log("state", state.dialogParams);
      console.log("sellContractsCall", params);
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : type === "nft"
          ? await Wallet.nftContractCall(params)
          : "";

      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("商品上架成功"),
              });
            }, 5000);
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("商品上架失败"),
        });
      }
    },
    async cancelSellContractsCall({ rootState, commit }, payload) {
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else if (payload.type === "nft") {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        console.log("nftStatus", nftStatus);
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("下架中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "OFFLINE",
        }
      );
      console.log("params", params);
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : type === "nft"
          ? await Wallet.nftContractCall(params)
          : "";

      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("商品下架成功"),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("商品下架失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("商品下架失败"),
        });
      }
    },
    async acceptBidContractsCall({ rootState, commit }, payload) {
      console.log("==acceptBidContractsCall==", payload);
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else if (payload.type === "nft") {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("获取收益中"),
      });
      const { type, args, tyArgs } = payload;
      let params = Object.assign(
        {},
        {
          args,
          tyArgs,
          provider: rootState.StoreWallet.stcProvider,
          type: "ACCEPT_BID",
        }
      );
      console.log("params", params);
      let txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall(params)
          : type === "nft"
          ? await Wallet.nftContractCall(params)
          : "";

      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                // dialogStatus: "success",
                // dialogText: utilsFormat.computedLangCtx("商品下架成功"),
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("接受报价收益成功", {
                  currency: payload.currency,
                  price: payload.price,
                }),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("获取收益失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("获取收益失败"),
        });
      }
    },
    async updatePriceContractsCall({ rootState, commit }, payload) {
      let onSell;
      if (payload.type === "box") {
        const boxStatus = await collectionApi.getSellingBoxDetail(
          payload.groupId,
          payload.chainId
        );
        if (boxStatus.code === 200) {
          onSell = boxStatus.data.onSell;
        }
      } else if (payload.type === "nft") {
        const nftStatus = await collectionApi.getSellingNftDetail(
          payload.infoId
        );
        if (nftStatus.code === 200) {
          onSell = nftStatus.data.onSell;
        }
      }
      if (!onSell) {
        commit(types.CHANGE_SOLD_DIALOG_PARAMS, {
          isShow: true,
          text: utilsFormat.computedLangCtx("提交失败"),
          subText: utilsFormat.computedLangCtx("商品已被售出"),
          btnText: utilsFormat.computedLangCtx("查看"),
        });
        return;
      }
      commit(types.CHANGE_DIALOG_STATUS, {
        isShow: true,
        dialogText: utilsFormat.computedLangCtx("更改售价中"),
      });
      const { type, args, tyArgs } = payload;
      const provider = rootState.StoreWallet.stcProvider;
      const txnHash =
        type === "box"
          ? await Wallet.blindBoxContractCall({
              provider,
              args,
              tyArgs,
              type: "CHANGE_PRICE",
            })
          : type === "nft"
          ? await Wallet.nftContractCall({
              provider,
              args,
              tyArgs,
              type: "CHANGE_PRICE",
            })
          : "";
      if (txnHash !== "error") {
        commit(types.CHANGE_DIALOG_STATUS, {
          phase1: "success",
        });
        utilsTools.pollingTxnInfo({ txnHash }).then((res) => {
          if (res === "Executed") {
            commit(types.CHANGE_DIALOG_STATUS, {
              phase2: "success",
            });
            setTimeout(() => {
              commit(types.CHANGE_DIALOG_STATUS, {
                dialogStatus: "success",
                dialogText: utilsFormat.computedLangCtx("售价更改成功"),
                successBtnText: utilsFormat.computedLangCtx("确认"),
              });
            }, 5000);
          } else {
            commit(types.CHANGE_DIALOG_STATUS, {
              dialogStatus: "failed",
              dialogText: utilsFormat.computedLangCtx("售价更改失败"),
            });
          }
        });
      } else {
        commit(types.CHANGE_DIALOG_STATUS, {
          dialogStatus: "failed",
          dialogText: utilsFormat.computedLangCtx("售价更改失败"),
        });
      }
    },
  },
};

export default StoreCollection;
