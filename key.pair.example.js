import { HDKEY, DID } from './lib/esm/index.js';


(async()=> {
    let signature = '9d7020006cf0696334ead54fffb859a8253e5a44860c211d23c7b6bf842d0c63535a5efd266a647cabdc4392df9a4ce28db7dc393318068d93bf33a32adb81ae';
    let secretKey = '123456789'
    
    const ed = new HDKEY(secretKey);
    const chainCode = ed.chainCode;
    console.log('get sign from metamask: ', chainCode)
    
    const keyPair = ed.createEDKeyPair(signature);
    console.log('keyPair: ', keyPair);
    console.log('exportKeyPair: ', ed.exportEDKeyPair())

    const subKey = ed.deriveKeyPath("m/1'/0'");
    console.log('subKey: ', subKey)
    console.log('exportKeyPath: ', ed.exportKeyPath("m/0'/0'"))

    
    const did = new DID(ed.exportEDKeyPair());
    console.log('did: ', did.did());
    console.log('pid: ', await did.pid());
})()