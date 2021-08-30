import { randomBytes } from 'crypto';
import { HDNode } from '@bitgo/utxo-lib';
import { addHexPrefix, pubToAddress } from 'ethereumjs-util';
import { DefaultKeys, isPrivateKey, isPublicKey, isSeed, KeyPairOptions } from '../baseCoin/iface';
import { Secp256k1ExtendedKeyPair } from '../baseCoin/secp256k1ExtendedKeyPair';

const DEFAULT_SEED_SIZE_BYTES = 16;

/**
 * Avalanche keys and address management for the C-Chain.
 */
export class KeyPair extends Secp256k1ExtendedKeyPair {
  /**
   * Public constructor. By default, creates a key pair with a random master seed.
   *
   * @param { KeyPairOptions } source Either a master seed, a private key (extended or raw), or a public key
   *     (extended, compressed, or uncompressed)
   */
  constructor(source?: KeyPairOptions) {
    super(source);
    if (!source) {
      const seed = randomBytes(DEFAULT_SEED_SIZE_BYTES);
      this.hdNode = HDNode.fromSeedBuffer(seed);
    } else if (isSeed(source)) {
      this.hdNode = HDNode.fromSeedBuffer(source.seed);
    } else if (isPrivateKey(source)) {
      this.recordKeysFromPrivateKey(source.prv);
    } else if (isPublicKey(source)) {
      this.recordKeysFromPublicKey(source.pub);
    } else {
      throw new Error('Invalid key pair options');
    }

    if (this.hdNode) {
      this.keyPair = this.hdNode.keyPair;
    }
  }

  /**
   * Avalanche C-Chain default keys format is the same as ethereum: raw private and uncompressed public key
   *
   * @returns { DefaultKeys } The keys in the protocol default key format
   */
  getKeys(): DefaultKeys {
    return {
      pub: this.getPublicKey({ compressed: false }).toString('hex').toUpperCase(),
      prv: this.getPrivateKey()?.toString('hex').toUpperCase(),
    };
  }

  /**
   * Get an Avalanche C-Chain public address in ethereum format
   *
   * @returns {string} The address derived from the public key
   */
  getAddress(): string {
    const publicKey = Buffer.from(this.getKeys().pub, 'hex'); // first two characters identify a public key
    return addHexPrefix(pubToAddress(publicKey, true).toString('hex'));
  }
}
