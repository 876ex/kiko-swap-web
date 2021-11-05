import commonApi from "@api/common";
import dayjs from "dayjs";
const JWT = require("jsonwebtoken");
import NFT_CONSTANTS from "@constants/nft.js";
import { findIndex } from "lodash";

const openNewWindow = (url) => {
  window.open(url, "_blank");
};

/**
 *
 * @param {16string} hexCharCodeStr
 * @returns
 */
const hexCharCodeToStr = (hexCharCodeStr) => {
  let trimedStr = hexCharCodeStr.trim();
  let rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x"
      ? trimedStr.substr(2)
      : trimedStr;
  let len = rawStr.length;
  if (len % 2 !== 0) {
    return "";
  }
  let curCharCode;
  let resultStr = [];
  for (let i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
};

/**
 * 轮询查上链信息
 * @param {txnHash, delay}
 * @returns
 */
const pollingTxnInfo = ({ txnHash, delay = 1000 } = {}) => {
  // 考虑一定次数后仍然拿不到信息直接reject？?
  return new Promise((resolve) => {
    commonApi.getTransactionInfo(txnHash).then((res) => {
      console.log("====>pollingTxnInfo======>", res);
      if (res.result) {
        if (res.result.status === "Executed") {
          resolve(res.result.status);
        } else {
          const { MoveAbort } = res.result?.status;
          const { address, name } = MoveAbort?.location?.Module;
          console.log("MoveAbort", MoveAbort);
          console.log("address", address, "name", name);
          const index = findIndex(
            NFT_CONSTANTS.NFT_ERROR_CODES,
            (d) => String(d.code) === String(MoveAbort.abort_code)
          );
          console.log("===index-===", index);
          if (
            index > -1 &&
            address === process.env.VUE_APP_NFT_ADDRESS &&
            name === process.env.VUE_APP_NFT_MARKET_ID
          ) {
            resolve("NoExisted");
          }
        }
      } else {
        setTimeout(() => {
          resolve(pollingTxnInfo({ txnHash }));
        }, delay);
      }
    });
  });
};

/**
 * 隐藏nft-image地址
 * @param {*} path
 * @returns
 */
const getImgTruePath = (path) => {
  if (!path) return;
  const isNeedProxy = process.env.VUE_APP_IS_NEED_PROXY_IMG_PATH;
  if (isNeedProxy) {
    // 本地代理使用
    path = path.match(/v1(.*)/g)[0];
  }
  return new Promise((resolve) => {
    commonApi.getImgTruePath(path).then((res) => {
      if (res.code === 200) {
        resolve(res.data);
      }
    });
  });
};

const setJWT = () => {
  const token = JWT.sign(
    { iss: "kiko", exp: dayjs().add(10, "m").valueOf() },
    "4858BAe65490df199FE8D76aC9087620",
    {
      algorithm: "HS256",
    }
  );
  return token;
};

export default {
  openNewWindow,
  hexCharCodeToStr,
  pollingTxnInfo,
  getImgTruePath,
  setJWT,
};
