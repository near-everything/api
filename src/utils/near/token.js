const blockchain = require("./blockchain");
const api = require("./api");
const path = require('path');
const fs = require("fs");
const user = require("./user");
const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, "utf8"));

module.exports = {
  /**
   * @return {string}
   */
  ViewNFT: async function (tokenId, contract) {
    try {
      const nftContract = contract ? contract : settings.nft_contract;
      return await blockchain.View(nftContract, "nft_token", {
        token_id: tokenId,
      });
    } catch (e) {
      return api.reject(e);
    }
  },

  /**
   * @return {string}
   */
  MintNFT: async function (tokenId, metadata, username) {
    const nftContract = settings.nft_contract;

    let account = await blockchain.GetUserAccount(username);
    try {
      const tx = await account.functionCall( // depreciated
        nftContract,
        "nft_mint",
        {
          token_id: tokenId.toString(), // make this text
          metadata: metadata,
          receiver_id: username
        },
        "100000000000000",
        "10000000000000000000000"
      );

      if (!tx.status.Failure) return tx.transaction.hash;
    } catch (e) {
      return api.reject(e);
    }
  },

  TransferNFT: async function (
    tokenId,
    receiverId,
    enforceOwnerId,
    memo,
    contractAccountId,
    owner_private_key
  ) {
    try {
      const nftContract = contractAccountId
        ? contractAccountId
        : settings.nft_contract;
      let account;

      account = !(enforceOwnerId && owner_private_key)
        ? enforceOwnerId === settings.master_account_id
          ? await blockchain.GetMasterAccount()
          : await blockchain.GetUserAccount(enforceOwnerId)
        : await blockchain.GetAccountByKey(enforceOwnerId, owner_private_key);

      return await account.functionCall(
        nftContract,
        "nft_transfer",
        {
          token_id: tokenId,
          receiver_id: receiverId,
          enforce_owner_id: enforceOwnerId,
          memo: memo,
        },
        "100000000000000",
        "1"
      );
    } catch (e) {
      return api.reject(e);
    }
  },
};
