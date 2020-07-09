# did-utils
Functions on resolvable DIDs which do not require private key material

These functions work using the Resolver class as defined in the [did-resolver DIF module](http://github.com/decentralized-identity/did-resolver).

## Exports

### Verify Signature against DID Key Reference
```typescript
verifySignature (r: Resolver) => async (signer: string, data: Uint8Array, signature: Uint8Array): Promise<boolean>
```

Verifies a signature against some data and a reference to a key in a DID Document, e.g. `did:jolo:example12345#keys-1`. Uses the given Resolver to resolve the DID of the signer.

### Encrypt To DID Key Reference
``` typescript
sealBoxToDID (r: Resolver) => async (recipient: string, data: Uint8Array): Promise<Uint8Array>
```

Encrypts data to a recipient [X25519KeyAgreementKey](https://w3c-ccg.github.io/security-vocab/#keyAgreement), again in the form of a DID key reference. Returns the encrypted data as a LibSodium Sealed Box, decryptable only by the private key corrosponding to the resolved recipient public key reference. Uses the given Resolver to resolve the DID of the recipient.

## Examples

### Verification
``` typescript
import { Resolver } from 'did-resolver'
import { getResolver } from '@jolocom/resolver'
import { verifySignature } from '@jolocom/did-utils'

const message = "hello there"
const signature = Buffer.from("a signature")
const signer = "did:jolo:example#keys-1"

const resolver = new Resolver(getResolver())

verifySignature(resolver)(signer, Buffer.from(message), signature).then(result => {
    console.log(result)
})
```

### Encryption
``` typescript
import { Resolver } from 'did-resolver'
import { getResolver } from '@jolocom/resolver'
import { sealBoxToDID } from '@jolocom/did-utils'

const message = "hello there"

const recipient = "did:jolo:#enc-1"

const resolver = new Resolver(getResolver())

const sealedBox = await sealBoxToDID(resolver)(recipient, Buffer.from(message))
```

