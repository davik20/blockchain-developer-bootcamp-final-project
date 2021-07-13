const { default: Web3 } = require("web3");

const Rent = artifacts.require("Rent");

module.exports = async function (deployer,  n, accounts) {
  await deployer.deploy(Rent);
  console.log(accounts)

  const rent = await Rent.deployed()
  const toWei = (amount)=> {
   
    return web3.utils.toWei(amount, 'Ether')
  }
  // create Rent
  // await rent.createRent('Honda Accord 2018', 'The 2018 Honda Accord finishes near the top of our midsize car rankings because of its excellent safety scores, expansive cabin, and numerous standard driver assistance features.', toWei('0.003'), toWei('0.001'));
  // await rent.createRent('2014 Acura ILX Hybrid Review', 'The 2014 Acura ILX Hybrid suffers from dismal overall performance, but it manages a midpack ranking thanks to its great reliability score, good crash test ratings, and low ownership costs. ', toWei('0.003'), toWei('0.006'));
  // await rent.createRent('2012 Dodge Caliber Review', 'Reviewers weren’t very impressed with the 2012 Dodge Caliber, citing a lackluster engine, a noisy powertrain and poor fuel economy.', toWei('0.0054'), toWei('0.003'));

  // let rentDetail  = await rent.rentDetails(1);
  // console.log(rentDetail)
  
  // await rent.takeRent(1,  1, {value: toWei('5'),from: accounts[1]})
  

  // const rentCount = await rent.rentCount()
  // console.log(rentCount.toString())
  // const allRents = await rent.getAllRent()
  // console.log(allRents)

  // rentDetail  = await rent.rentDetails(1);
  // console.log(rentDetail)

};
