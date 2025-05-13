const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function getContract() {
  const ccpPath = path.resolve(__dirname, '../config/connection-org1.json');
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const walletPath = path.join(__dirname, '../wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = await wallet.get('admin');
  if (!identity) throw new Error('Admin identity not found in wallet');

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'admin',
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('foodchain6');
  const contract = network.getContract('basic');

  return { gateway, contract };
}

module.exports = { getContract };
