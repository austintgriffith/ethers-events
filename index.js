import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import { ethers } from "ethers";

const SIMPLE_STREAM_ABI = [{"inputs":[{"internalType":"address payable","name":"_toAddress","type":"address"},{"internalType":"uint256","name":"_cap","type":"uint256"},{"internalType":"uint256","name":"_frequency","type":"uint256"},{"internalType":"bool","name":"_startsFull","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"cap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"frequency","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"last","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"streamBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"reason","type":"string"}],"name":"streamDeposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"reason","type":"string"}],"name":"streamWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"toAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]

//as an example we'll use http://elliottalexander.buidlguidl.com/
const SIMPLE_STREAM_ADDRESS = "0x86c6C2c9699bE74278E0d73065fF12249221Bd30"

const main = async () => {

  const rpcUrl = "https://rpc.scaffoldeth.io:48544"

  console.log("Connecting to "+rpcUrl)

  const scaffoldEthProvider = new StaticJsonRpcProvider(rpcUrl);

  //const currentBlock = await scaffoldEthProvider.getBlockNumber()
  //console.log("Checking current block to make sure we are connected... ",currentBlock)

  const streamBalance = await scaffoldEthProvider.getBalance(SIMPLE_STREAM_ADDRESS)

  console.log("Current balance",formatEther(streamBalance))

  //I think this resets it so we get all events
  scaffoldEthProvider.resetEventsBlock(0)

  const streamContract = new ethers.Contract(SIMPLE_STREAM_ADDRESS, SIMPLE_STREAM_ABI, scaffoldEthProvider);

  //const withdrawFilter = streamContract.filters.Withdraw(null);

  //const streamWithdrawLogs = await streamContract.queryFilter(withdrawFilter, -10, "latest");

  //console.log("streamWithdrawLogs",streamWithdrawLogs)


  let filter = streamContract.filters.Withdraw()
  filter.fromBlock = 14199040;
  filter.toBlock = 14199050;

  scaffoldEthProvider.getLogs(filter).then((logs) => {
      logs.forEach((log) => {
          //console.log(log)
          const data = streamContract.interface.parseLog(log)
          console.log("data",data)
      })
  })

}




main()
