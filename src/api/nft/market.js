import request from "../../utils/request";

export default {
  // 获取市场列表数据
  getMarketList(params) {
    const { groupId, currency, open, pageSize, pageNum, sort } = params;
    return request({
      url:
        "/v1/nft/market/getALL?groupId=" +
        groupId +
        "&currency=" +
        currency +
        "&open=" +
        open +
        "&pageSize=" +
        pageSize +
        "&pageNum=" +
        pageNum +
        "&sort=" +
        sort,
      method: "GET",
    });
  },
  //获取盲盒详情
  getBlindBoxDetail(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}/${params.chainId}`,
      method: "GET",
    });
  },
  // 获取NFT详情
  getNFTDetail(params) {
    return request({
      url: `/v1/nft/nft/info/${params.id}`,
      method: "GET",
    });
  },
  // 取消出售
  cancelSell(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}`,
      method: "GET",
    });
  },
  // 接受报价
  acceptBiding(params) {
    return request({
      url: `/v1/nft/box/info/${params.groupId}`,
      method: "GET",
    });
  },
  // 购买NFT
  purchase(params) {
    console.log("params.id", params.id);
    return true;
  },
  // 出价
  bidPrice(params) {
    console.log("params.id", params.id);
    return true;
  },
  // 更改报价
  updatePrice(params) {
    console.log("params.id", params.id);
    return true;
  },
  // 详情页轮询商品是否在售卖
  queryIsSelling(params) {
    return request({
      url: `/v1/nft/market/boxExist/${params.id}`,
      method: "GET",
    });
  },
};
