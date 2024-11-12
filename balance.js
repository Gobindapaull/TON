import { TonClient, getHttpEndpoint } from "@ton-community/client";

async function main() {
  const endpoint = await getHttpEndpoint({ network: "mainnet" });
  const client = new TonClient({ endpoint });
  
  const address = "your-address-here";
  const balance = await client.getBalance(address);
  
  console.log(`Balance for ${address}: ${balance} TON`);
}

main().catch(console.error);
