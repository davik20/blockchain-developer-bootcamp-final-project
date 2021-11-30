const { assert } = require("chai");
const { default: Web3 } = require("web3");

const Rent = artifacts.require("Rent");
// const Web3 = require('web3')
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Rent", function ( accounts ) {
  let [contractOwner, Sady, Sam] = accounts
  let instance;
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  const amount = 0.03 + 0.2
  beforeEach(async () => {
     instance = await Rent.new();
  });

  it("should assert true", async function () {
    await Rent.deployed();
    return assert.isTrue(true);
  });

  it("is owned by owner", async () => {
    assert.equal(
    
      await instance.owner.call(),
      contractOwner,
      "owner is not correct",
    );
  });

  it("can create a rentable car", async()=> {
     await instance.createRent("Honda Accord", "2008, Sedatn", toWei("0.03"), toWei("0.2"), {
       from: Sady
     })

     const car =   await instance.getRent.call(1)
   assert.equal(car.owner, Sady, "Car renting failed")

  })
  it("can rent a car", async()=> {
     await instance.createRent("Honda Accord", "2008, Sedan", toWei("0.03"), toWei("0.2"), {
       from: Sam
     })
      await instance.getAllRent.call()
 

     await instance.takeRent(1, 0, {from: Sady, value : toWei(String(amount))});
     const car =   await instance.getRent.call(1)

   assert.equal(car.person , Sady, "Car renting failed")

  })
  it("can return a car", async()=> {
     await instance.createRent("Honda Accord", "2008, Sedan", toWei("0.03"), toWei("0.2"), {
       from: Sam
     })

     await instance.takeRent(1, 0, {from: Sady, value : toWei(String(amount))});
      await instance.returnRent(1, {from:Sady})

     const car =   await instance.getRent.call(1)

   assert.equal(car.person , emptyAddress, "Car wasnt returned successfully")

  })
});


function toWei(amount) {
  return web3.utils.toWei(String(amount), 'Ether');
}