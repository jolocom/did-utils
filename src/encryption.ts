import { box } from 'tweetnacl'
import * as sealedbox from 'tweetnacl-sealedbox-js'
import { Resolver } from 'did-resolver'

import { getKeySection, getKeyBytes } from './utils'
import { DIDKeyTypes } from './types'

export const sealBoxToDid = (resolver: Resolver) =>
    async (recipient: string, data: Uint8Array): Promise<Uint8Array> => {
    const [did, keyRef] = recipient.split('#')
    const key = await getKeySection(resolver)(did, keyRef)

    if (key.type !== DIDKeyTypes.X25519KeyAgreementKey2019) {
        throw new Error("Incorrect Key Type")
    }
    
    return sealedbox.seal(data, getKeyBytes(key))
}

