// Sha3 est un module permetant de "hasher" nos documents
const { SHA3 } = require("sha3");
const hash = new SHA3(256);
const fs = require("fs");
const fileName = "./blochain.json";
let nonce = 0;
const difficulty = "000";
let notFounded = true;

const updateBlockchain = (id, timestamp, nonce) => {
  let blockchain = require(fileName);
  const addBlock = {
    id: id,
    timestamp: timestamp,
    nonce: nonce
  };
  blockchain.push(addBlock);
  fs.writeFile(
    fileName,
    JSON.stringify(blockchain, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
};

const mining = () => {
  var start = new Date().getTime();
  const blockchain = require(fileName);
  while (notFounded) {
    hash.reset();
    hash.update(JSON.stringify(blockchain) + nonce);
    let hashed = hash.digest("hex");
    if (hashed.startsWith(difficulty)) {
      var diff = (new Date().getTime() - start) / 1000;
      notFounded = false;
      console.log("\x1b[46m%s\x1b[0m", "//// FOUNDED ! ////");
      console.log(`Hash : ${hashed}`);
      console.log(`Nonce : ${nonce}`);
      console.log(`Total time : ${diff}s`);
      console.log("\x1b[46m%s\x1b[0m", "////           ////");
      updateBlockchain(hashed, Date.now(), nonce);
    } else {
      nonce++;
    }
  }
};

mining();
