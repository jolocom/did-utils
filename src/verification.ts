import { sign } from 'tweetnacl'
import { verify } from 'tiny-secp256k1'
import { Resolver } from 'did-resolver'
import { createHash } from 'crypto'

import { getKeySection, getKeyBytes } from './utils'
import { DIDKeyTypes } from './types'

export const verifySignature = (resolver: Resolver) =>
    async (signer: string, data: Uint8Array, signature: Uint8Array): Promise<boolean> => {
        const [did, keyRef] = signer.split("#")
        
        const key = await getKeySection(resolver)(did, keyRef)

        if (key.type === DIDKeyTypes.EcdsaSecp256k1VerificationKey2019) {
            return verify(createHash('sha256').update(data).digest(), Buffer.from(getKeyBytes(key)), Buffer.from(signature))
        } else if (key.type === DIDKeyTypes.Ed25519VerificationKey2019) {
            return sign.detached.verify(data, signature, getKeyBytes(key))
        }
            throw new Error("Incorrect Key Type")
}
