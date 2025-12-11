import {
loadMoneroDylib,
Wallet,
WalletManager,
} from "https://raw.githubusercontent.com/karlbuys/monero_c/main/impls/monero.ts/mod.ts";

// Try to load dylib from the default lib/* path
// You can also use loadWowneroDylib for Wownero
loadMoneroDylib();

const wm = await WalletManager.new();
const wallet = await wm.createWallet("./my_wallet", "password");

console.log(await wallet.address());

await wallet.store();