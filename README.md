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

`Ed25519` KeyPairs are used for creating DID, PID (Peer-Id), JWE/JWET/JWT signing identity of token which is passed as `iss:` attribyte of the payload. In same way opposite side user can verify or/and decrypt by passing their own KeyPair.   


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


    // Prefix moc keys
    let secretKey = '123456789'
    let signedKey = '9d7020006cf0696334ead54fffb859a8253e5a44860c211d23c7b6bf842d0c63535a5efd266a647cabdc4392df9a4ce28db7dc393318068d93bf33a32adb81ae';

    
    /* Add user`s secretKey */
    const ed = new HDKEY(secretKey);
    
    // 1. Sign with chaincode   |chainCode| --->  |Metamask|      
    // 2. Get signedKey         |signedKey| <---  |Metamask| 

    /* Get chainCode to get signedKey from Metamask*/
    const chainCode = ed.chainCode;
    /* Send request to metamask*/

    /* Get KeyPair: Publick and Privete Key */
    const keyPair = ed.createEDKeyPair(signedKey);
    /* Utilize keyPair for UCAN and also for DID, Encryption */

    /* Add KeyPair in order to generate DID and PID*/
    const did = new DID(keyPair.secretKey);
    
    /* Get DID and PID */
    did.did();
    await did.pid();
   ```
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Json Web Encrypted Token / Time Based Encryption 
   ```js
    import { EncryptJWT, DecryptJWT } from '@functionland/fula-sec'
     
     /* Securly export your wrapped wnfs key */
     const jwet = await new EncryptJWT({ aud: did.did(), iat: undefined, wnfsKey: 'export your wnfs key'})
        .setIssuedAt()
        .setNotBefore(Math.floor(Date.now() / 1000))
        .setIssuer(did.did())
        .setAudience(did.did())
        .setExpirationTime('3s')
        .encrypt(keyPair.secretKey);

    /* Verify and decrypt to get your wnfs key */
     const payload = await new DecryptJWT(keyPair.secretKey).verify(jwet)    
   ```


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Content
- [X] HDKEY Drive
- [X] Identity (DID)
- [X] PeerId (PID)
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
