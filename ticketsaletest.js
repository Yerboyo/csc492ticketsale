const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');


let accounts;
let ticketsale;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  ticketsale = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [100000,1],
    })
    .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});
});


describe("ticketsale", () => {
  it("deploys a contract with owner", () => {
    assert.ok(ticketsale.options.address);
  });

  it("verify buyTicket", async () => {
    ticketsale.methods.buyTicket(2).send({ from: accounts[1], value: 1, gasPrice: 8000000000000, gas: 4700000});
    const ticketid = await ticketsale.methods.getTicketOf(accounts[1]).call();
    assert.equal(ticketid, 2);
  });

  it("verify offerSwap", async () => {
    ticketsale.methods.buyTicket(1).send({ from: accounts[1], value: 1, gasPrice: 8000000000, gas: 4700000});
    ticketsale.methods.buyTicket(2).send({ from: accounts[2], value: 1, gasPrice: 8000000000, gas: 4700000});
    offer = await ticketsale.methods.offerSwap(accounts[2]).send({ from: accounts[1]});
    const expected = accounts[2];
    assert(offer, expected);
  });

  it("verify acceptSwap", async () => {
    ticketsale.methods.buyTicket(1).send({ from: accounts[1], value: 1, gasprice: 8000000000, gas: 4700000});
    ticketsale.methods.buyTicket(2).send({ from: accounts[2], value: 1, gasPrice: 8000000000, gas: 4700000});

    ticketsale.methods.offerSwap(accounts[2]).send({ from: accounts[1], gasprice: 8000000000, gas: 4700000});
    ticketsale.methods.acceptSwap(accounts[1]).send({ from: accounts[2], gasprice: 8000000000, gas: 4700000});

    const ticketid = await ticketsale.methods.getTicketOf(accounts[1]).call();
    assert(ticketid, 2);
  });

});