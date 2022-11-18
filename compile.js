const path = require('path');
const fs = require('fs');
const solc = require('solc');

const ticketPath = path.resolve(__dirname, 'contracts', 'Ticketsale.sol');
const source = fs.readFileSync(ticketPath, 'utf8');


let input = {
  language: "Solidity",
  sources: {
    "Ticketsale.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts["Ticketsale.sol"];

for (let contractName in contracts) {
  const contract = contracts[contractName];
  module.exports= {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};
}

console.log(contracts.ticketsale);

