"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const bip32 = require("bip32").BIP32Factory;
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const MoleculerClientError = require("moleculer").Errors.MoleculerClientError;

// define the network
// const network = bitcoin.networks.bitcoin;

// Derivation path
// const path = "m/44'/0'/0'/0/0";

module.exports = {
	name: "blockchain.bitcoin",

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		createWallet: {
			rest: "GET /create-wallet",
			async handler(ctx) {
				try {
					const network = bitcoin.networks.bitcoin; //use networks.testnet for testnet

					// Derivation path
					const path = "m/49'/0'/0'/0"; // Use m/49'/1'/0'/0 for testnet

					let mnemonic = bip39.generateMnemonic();
					const seed = bip39.mnemonicToSeedSync(mnemonic);
					const root = bip32(ecc).fromSeed(seed, network);

					let account = root.derivePath(path);
					let node = account.derive(0).derive(0);

					let btcAddress = bitcoin.payments.p2pkh({
						pubkey: node.publicKey,
						network: network,
					}).address;

					console.log(`
					  Wallet generated:
					  - Address  : ${btcAddress},
					  - Key : ${node.toWIF()},
					  - Mnemonic : ${mnemonic}

					  `);

					return {
						address: btcAddress,
						key: node.toWIF(),
						mnemonic: mnemonic,
					};
				} catch (error) {
					console.error("Error creating wallet:", error);
					throw error;
				}
			},
		},
		transferTest: {
			rest: "POST /transfer-test",
			params: {
				address: { type: "string", required: true },
				amount: { type: "number", required: true },
				key: { type: "string", required: true },
			},
			async handler(ctx) {
				try {
					const { address, amount, key } = ctx.params;
					const network = bitcoin.networks.bitcoin; //use networks.testnet for testnet
					// transfer bitcoin
					// const tx = new bitcoin.TransactionBuilder(network);
					// const utxo = await this.getUTXO(address);
					// const utxoAmount = utxo.value;
					// const utxoIndex = utxo.index;
					// const utxoScript = utxo.scriptPubKey;
					// const utxoTxId = utxo.txid;
					// const utxoVout = utxo.vout;
					// const utxoSatoshi = utxoAmount * 100000000;
					// const satoshi = amount * 100000000;
					// const fee = 0.0001 * 100000000;
					// const change = utxoSatoshi - satoshi - fee;
					// const changeAddress = address;
					// const changeScript = bitcoin.address.toOutputScript(
					// 	changeAddress,
					// 	network
					// );
					// const changeSatoshi = change * 100000000;
					// const changeAmount = change / 100000000;
					// const changeAmountSatoshi = changeAmount * 100000000;
					// const changeAmountSatoshiString =
					// 	changeAmountSatoshi.toString();
					// const changeAmountSatoshiStringFixed =
					// 	changeAmountSatoshiString.substring(
					// 		0,
					// 		changeAmountSatoshiString.length - 8
					// 	);
					// const changeAmountSatoshiStringFixedFixed =
					// 	changeAmountSatoshiStringFixed.substring(
					// 		0,
					// 		changeAmountSatoshiStringFixed.length - 1
					// 	);
				} catch (error) {
					console.error("Error creating wallet:", error);
					throw new MoleculerClientError(
						"Error transfering",
						500,
						"BLOCKCHAIN_ERROR",
						error
					);
				}
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
