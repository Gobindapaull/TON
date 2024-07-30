import { getHttpEndpoint, getHttpEndpoints } from "@orbs-network/ton-access"
import { mnemonicToWalletKey } from "@ton/crypto"
import { fromNano, internal, TonClient, WalletContractV4 } from "@ton/ton"

console.log(`TON BLOCKCHAIN`)

async function main() {
    const mnemonic = ""
    const key = mnemonicToWalletKey(mnemonic.split(""))
    const wallet = WalletContractV4.create({publicKey: (await key).publicKey, workchain: 0})
    console.log(`wallet address : ${wallet.address}`)

    const endpoint = await getHttpEndpoint({network: "testnet"})
    const client = new TonClient({endpoint})
    
    const balance = await client.getBalance(wallet.address)
    console.log(`wallet balance : ${fromNano(balance)}`)

    if (!await client.isContractDeployed(wallet.address)) {
        console.log("contract is not deployed")
    }

    const walletContract = client.open(wallet)
    const seqNo = await walletContract.getSeqno()
    await walletContract.sendTransfer({
        secretKey: (await key).secretKey,
        seqno: seqNo,
        messages: [
            internal({
                to: "UQAHjDzK2SORi3DK-_S0BKF9AD30-Tbgaa9Tlv_K-jcPUAzZ",
                value: "0.0001",
                body: "Test transfer TON",
                bounce: false
            })
        ]
    })

    let currentSeqNo = seqNo
    while(currentSeqNo == seqNo) {
        console.log("Waiting for transaction to confirm ...")
        await sleep(1500)
        currentSeqNo = await walletContract.getSeqno()
    }
    console.log("Transaction confirmed :)")

}

main()

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// TON Blockchain
// send ton transfer script

// "dependencies": {
//     "@orbs-network/ton-access": "^2.3.3",
//     "@ton/core": "^0.56.3",
//     "@ton/crypto": "^3.3.0",
//     "@ton/ton": "^14.0.0",
//     "ts-node": "^10.9.2"
//   }

