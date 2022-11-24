<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
*** Nice Template: https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<div align="center">


<h3 align="center">Fula Security Layer (FSL)</h3>

  <p align="center">
    Fula Security Layer Includes Decentralized Identity and Encryption.
    <br />
  </p>
</div>

#
The Fula-sec library allows you to create DID (Decentrlized-ID) and Encript/Decypt by using `Ed25519` and `EDHD` algorithms.

`Ed25519` KeyPairs are used for creating DID, JWE/JWET/JWT signing identity of token which is passed as `iss:` attribyte of the payload. In same way opposite side user can verify or/and decrypt by passing their own KeyPair.   


## Installation


Install NPM package
   ```sh
   npm install @functionland/fula-sec --save
   ```
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Decentralized Identity (DID) 
   ```js
    import {HDKEY, DID} from '@functionland/fula-sec'


    /* Prefix moc keys */
    let password = '123456789'  //User`s password
    let signedKey = '9d7020006cf....f33a32adb81ae'; 
    /* signedKey is the signature coming from the locally-running 
    service of a 3rd party signing authority like Meta Mask Wallet 
    by signing part of the password (not the full password is being 
    sent to the 3rd party signing authority)
    */

    
    /* 1 - Add user`s password */
    const ed = new HDKEY(password);
    
    // A. Sign with chaincode   |chainCode| --->  |Metamask|      
    // B. Get signedKey         |signedKey| <---  |Metamask| 

    /* 2 - Get chainCode to get signedKey from Metamask*/
    const chainCode = ed.chainCode; 
    /*
      chainCode is created from part of the password to be sent 
      to the signing authority like MetaMask wallet to get a unique signature back
    */
    `type:base64pad APSWnk8ULP/v//oseMeSEDadMBSSeX/SOxOREYhjQ7g=`
    /* Send request to metamask*/

    /* 3 - Get KeyPair: Publick and Privete Key */
    const keyPair = ed.createEDKeyPair(signedKey);
    `secretkey:  Uint8Array(64) [
         98,  47,  78, 171, 169, 201, 236, 231, 196,  23, 134,
         135,  78, 180, 195,  93,  22,  57,  41, 213,  53,  86,
         248,  34,  83, 162, 233, 128,  89, 128, 207, 173, 247,
         94, 235,  66, 181, 212, 204, 168, 133, 182,  87, 227,
         217, 233, 122, 169, 145,  20,  42, 110, 229, 233, 239,
         112,  55, 203,  18, 112,  50, 251, 239, 219
      ],
      pubkey:  Uint8Array(32) [
         247,  94, 235,  66, 181, 212, 204,
         168, 133, 182,  87, 227, 217, 233,
         122, 169, 145,  20,  42, 110, 229,
         233, 239, 112,  55, 203,  18, 112,
         50, 251, 239, 219
      ]`
    
    /* keyPair: {
         publicKey,
         secretKey    
    } for creating DID and Encrypt/Decrypt */
    
    

    /* 4 - Add KeyPair in order to generate DID*/
    const did = new DID(keyPair.secretKey);
    
    /* Get DID */
    did.did();
   `did:key:z6MknwZL7aFNFGoq7ZaZv47LF7tiqtwV3ZrYRbAJEmUWRRkh`
   ```
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Json Web Encrypted Token / Time Based Encryption 
   ```js
    import { EncryptJWT, DecryptJWT } from '@functionland/fula-sec'
     
     /* Securly export your wrapped wnfs key */
     const jwet = await new EncryptJWT({ any: 'your sensitive data to encrypt'})
        .setIssuedAt()
        .setNotBefore(Math.floor(Date.now() / 1000))
        .setIssuer(did.did())
        .setAudience(did.did())
        .setExpirationTime('3s')
        .encrypt(keyPair.secretKey);

    /* Verify and decrypt to get your wnfs key within 3 second as declared above */
     const payload = await new DecryptJWT(keyPair.secretKey).verify(jwet)    
      `payload:  {
         aud: 'did:key:z6MknwZL7aFNFGoq7ZaZv47LF7tiqtwV3ZrYRbAJEmUWRRkh',
         exp: 1669043742,
         iat: 1669043738,
         iss: 'did:key:z6MknwZL7aFNFGoq7ZaZv47LF7tiqtwV3ZrYRbAJEmUWRRkh',
         nbf: 1669043738,
         any: 'your sensitive data to encrypt'
      }
      `
   ```


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Content
- [X] HDKEY Drive
- [X] Identity (DID)
- [X] JWE
- [X] JWET


See the [open issues](https://github.com/functionland/fula-sec/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

## Development
- You have the opportunity to test it by installing a [demo application -> ](https://github.com/functionland/fula-linking)
- Fula documents related to Architecture, Protocol, dApps and  and usage can be found on the [Function land documentation site](https://functionland.gitbook.io/product-docs/EZsKoqxFAOfV4Ap7jQjB/)


## Community
- Connect with function land developers. Questions, support, and discussions: [Join the Fx Discord](https://discord.com/invite/k9UybUBdBB)
- Bugs and Feature Requests: Open an issue in the appropriate [Github repository](https://github.com/functionland)
- The latest updates can be found here. [Blog](https://blog.fx.land/), [twitter](https://twitter.com/functionland)


## Maintainers
- [Saidov](https://github.com/ruffiano)

<!-- LICENSE -->
## License

See [`LICENSE`](/LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
