import { Resolver, PublicKey } from "did-resolver";
import * as bs58 from 'bs58';

export const getKeyBytes = (k: PublicKey): Uint8Array => {
    if (k.publicKeyBase64) return Buffer.from(k.publicKeyBase64, 'base64')
    if (k.publicKeyBase58) return bs58.decode(k.publicKeyBase58)
    if (k.publicKeyHex) return Buffer.from(k.publicKeyHex, 'hex')

    throw new Error("Invalid Key Material Encoding")
}

export const getKeySection = (resolver: Resolver) => async (did: string, keyRef: string): Promise<PublicKey> => {
    const ddo = await resolver.resolve(did)
    const key = ddo.publicKey.find(pk => pk.id === keyRef)
    if (key) {
        return key
    } else {
        throw new Error("Key not found")
    }
}
