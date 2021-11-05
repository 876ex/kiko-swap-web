/* eslint-disable */
import request from "../../utils/request";

//获取盲盒详情
function getBoxDetail(boxToken, payToken) {
  return request({
    url: `/v1/nft/box/info`,
    method: "GET",
    params: {
      boxToken,
      payToken,
    },
  });
}

// 获取我的NFT销售中nft详情
function getSellingNftDetail(infoId) {
  return request({
    url: `/v1/nft/nft/info/${infoId}`,
    method: "GET",
  });
}

// 获取我的NFT销售中盲盒详情
function getSellingBoxDetail(groupId, chainId) {
  return request({
    url: `/v1/nft/box/info/${groupId}/${chainId}`,
    method: "GET",
  });
}

//获取未出售nft详情
function getNftDetail(nftMeta, nftBody, nftId) {
  return request({
    url: `/v1/nft/nft/info`,
    method: "GET",
    params: {
      nftMeta,
      nftBody,
      nftId,
    },
  });
}

function getMySeries() {
  return request({
    url: "/v1/nft/series/list",
    method: "GET",
    params: {
      all: true,
    },
  });
}

function groupList() {
  return request({
    url: "/v1/nft/group/list",
    method: "GET",
  });
}
//出售中
function getSellingData(userAddress) {
  return request({
    url: "/v1/nft/store/selling",
    method: "GET",
    params: {
      userAddress, //钱包地址
    },
  });
}

// 获取盲盒打开后hash
function getSellBoxIdByHash(hash) {
  let params = {
    id: 101,
    jsonrpc: "2.0",
    method: "chain.get_events_by_txn_hash",
    params: [hash, { decode: true }],
  };
  return request({
    headers: {
      "content-type": "application/json",
    },
    url: process.env.VUE_APP_CONTRACTS_SERVE_URL,
    method: "post",
    data: JSON.stringify(params),
  });
}

function getPurchaseHistory(payload) {
  return request({
    url: "/v1/nft/store/records",
    method: "GET",
    params: {
      direction: "buy",
      pageSize: 20,
      address: payload.address,
      pageNum: payload.pageNum,
    },
  });
}

function getSalesHistory(payload) {
  return request({
    url: "/v1/nft/store/records",
    method: "GET",
    params: {
      direction: "sell",
      pageSize: 20,
      address: payload.address,
      pageNum: payload.pageNum,
    },
  });
}

export default {
  getSellBoxIdByHash,
  getBoxDetail, //盲盒详情
  getNftDetail, //nft详情
  getMySeries,
  groupList,
  getSellingData, //出售中列表
  getSellingBoxDetail,
  getSellingNftDetail,
  getPurchaseHistory,
  getSalesHistory,
};
