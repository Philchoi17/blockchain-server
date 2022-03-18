"use strict";

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const Web3 = require("web3");
const MoleculerClientError = require("moleculer").Errors.MoleculerClientError;

module.exports = {
	name: "blockchain.ethereum",

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
		/**
		 * Create a new wallet.
		 * @param {Context} ctx
		 * @returns {Object}
		 * @memberof Actions
		 * @method createWallet
		 * @async
		 * @example
		 * 	{
		 * 		address: "0x...",
		 * 		privateKey: "0x..."
		 * 	}
		 */
		createWallet: {
			rest: "GET /create-wallet",
			async handler(ctx) {
				const web3 = new Web3().eth;
				const wallet = await web3.accounts.create();
				return wallet;
			},
		},
		/**
		 * Get balance of an address.
		 * @param {Context} ctx - { address: "0x..." }
		 * @returns {Object}
		 * @memberof Actions
		 * @method getBalance
		 * @async
		 */
		balanceOfTest: {
			rest: "POST /balance-test",
			params: {
				address: { type: "string", required: true },
			},
			async handler(ctx) {
				try {
					const { address } = ctx.params;
					const web3 = new Web3().eth;
					const balance = await web3.getBalance(address);
					return {
						address,
						balance,
					};
				} catch (error) {
					console.error("error", error);
					throw new MoleculerClientError( // name of the error
						error.message, // message
						500, // code
						"ERR_BALANCE_OF_TEST" // type
					);
				}
			},
		},
		/**
		 * Get balance of an address.
		 * @param {Context} ctx { from, to, value }
		 * @returns {Object}
		 * @memberof Actions
		 * @method getBalance
		 * @async
		 */
		transferTest: {
			rest: "POST /transfer-test",
			params: {
				from: { type: "string", required: true },
				to: { type: "string", required: true },
				value: { type: "number", required: true },
			},
			async handler(ctx) {
				try {
					const { from, to, value } = ctx.params;
					const web3 = new Web3().eth;
					const tx = await web3.sendTransaction({
						from,
						to,
						value,
					});
					return tx;
				} catch (error) {
					console.error("error", error);
					throw new MoleculerClientError( // name of the error
						error.message, // message
						500, // code
						"ERR_TRANSFER_TEST" // type
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
