import request from "../utils/request";

function getHomeData() {
  return request({
    url: "/v1/swap/exchange/totalAssets",
    method: "GET",
  });
}

function getTotalValue() {
  return [
    {
      value: "31231213",
      desc: "Total Value Locked",
    },
    {
      value: "98321321",
      desc: "Total Trading Volume",
    },
    {
      value: "08732",
      desc: "Users",
    },
  ];
}

export default {
  getHomeData,
  getTotalValue,
};
