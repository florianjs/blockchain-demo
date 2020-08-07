// Sha3 est un module permetant de "hasher" nos documents
const { SHA3 } = require("sha3");
const hash = new SHA3(256);
const fs = require("fs");

const fileName = "./blochain.json";

// Notre nonce démarre à 0
let nonce = 0;
// Paramétre de notre difficulté, plus il y a de 0, plus la difficulté est importante.
const difficulty = "000";
// Notre switch afin de gérer notre boucle while
let notFounded = true;

// Fonction permettant de mettre à jour notre blockchain.json
const updateBlockchain = (id, timestamp, nonce) => {
  let blockchain = require(fileName);
  // On créé notre nouveau Block qui va être rajouté à notre Blockchain
  const addBlock = {
    id: id,
    timestamp: timestamp,
    nonce: nonce,
  };
  // On ajoute notre Block à notre Blockchain
  blockchain.push(addBlock);
  // On réécris notre fichier blockchain.json
  fs.writeFile(
    fileName,
    JSON.stringify(blockchain, null, 2),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
};

// Notre fonction permettant de miner le Block
const mining = () => {
  var start = new Date().getTime();
  // On importe notre fichier JSON
  const blockchain = require(fileName);

  // On rentre dans notre boucle
  while (notFounded) {
    /**
     * On reset notre hash
     * Si, par example, notre hash contenais un String "Hello", nous effaçons ces donnés
     */
    hash.reset();
    // On rajoute nos nouvelles données dans notre Hash
    hash.update(JSON.stringify(blockchain) + nonce);
    //
    let hashed = hash.digest("hex");
    // Si notre nouveau Hash commence par "000"
    if (hashed.startsWith(difficulty)) {
      var diff = (new Date().getTime() - start) / 1000;
      // Nous mettons le switch en false afin de sortir de la boucle While
      notFounded = false;
      console.log("\x1b[46m%s\x1b[0m", "//// FOUNDED ! ////");
      console.log(`Hash : ${hashed}`);
      console.log(`Nonce : ${nonce}`);
      console.log(`Total time : ${diff}s`);
      console.log("\x1b[46m%s\x1b[0m", "////           ////");
      // On éxecute la fonction afin de mettre à jour notre Blockchain
      updateBlockchain(hashed, Date.now(), nonce);
    }
    // Sinon
    else {
      // Si vous souhaitez gagner en rapidité, supprimez le console.log ci-dessous
      console.log(hashed);
      // Nous incrementons le nonce avant de recommencer la boucle While
      nonce++;
    }
  }
};

// Demarrage du minage au lancement de l'application
mining();
