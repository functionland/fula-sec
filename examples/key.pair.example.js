import { HDKEY, DID } from '../lib/esm/index.js';


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


    /* Optional: drive new keyPair from master keyPair*/
    /*m/1'/0'. m is masterKey, number is index of keyTree*/ 
    const childKey = ed.deriveKeyPath("m/1'/0'");
    console.log('subKey: ', childKey)
    console.log('exportKeyPath encoded-base64pad key: ', ed.exportKeyPath("m/0'/0'"))

    
   /* 4 - Add KeyPair in order to generate DID*/
   const did = new DID(keyPair.secretKey);
   console.log('get did: ', did.did());
})()