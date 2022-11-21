import { HDKEY, DID, EncryptJWT, DecryptJWT } from '../lib/esm/index.js';

(async()=> {
    /* Prefix moc keys */
    let password = '123456789'  //User`s password
    let signedKey = '9d7020006cf0696334ead54fffb859a8253e5a44860c211d23c7b6bf842d0c63535a5efd266a647cabdc4392df9a4ce28db7dc393318068d93bf33a32adb81ae'; // signedKey from metamask

     /* 1 - Add user`s password */
    const ed = new HDKEY(password);

    // A. Sign with chaincode   |chainCode| --->  |Metamask|      
    // B. Get signedKey         |signedKey| <---  |Metamask| 

    /* 2 - Get chainCode to get signedKey from Metamask*/
    const chainCode = ed.chainCode;
    console.log('get signedKey from metamask: ', chainCode)
    
    /* 3 - Get KeyPair: Publick and Privete Key */
    const keyPair = ed.createEDKeyPair(signedKey);
     /* keyPair: {
      publicKey,
      secretKey    
    } for creating DID and Encrypt/Decrypt */
    console.log('secretkey: ', keyPair.secretKey);
    console.log('pubkey: ', keyPair.publicKey);


    /* 4 - Add KeyPair in order to generate DID*/
    const did = new DID(keyPair.secretKey);
    console.log('get did: ', did.did());

    /* Securly export your wrapped wnfs key */
    const jwet = await new EncryptJWT({ wnfsKey: 'whfs secretKey here past it here' })
    .setIssuedAt()
    .setNotBefore(Math.floor(Date.now() / 1000))
    .setIssuer(did.did())
    .setAudience(did.did())
    .setExpirationTime('3s')
    .encrypt(keyPair.secretKey);

    console.log('jwet: ', jwet)
    /* Verify and decrypt to get your wnfs key within 3 second as declared above */
    setTimeout(async()=> {
        const cyper = await new DecryptJWT(keyPair.secretKey).verify(jwet)
        console.log('cyper: ', cyper)
    }, 2000)
})();