import os 

from cosmpy.aerial.client import LedgerClient, NetworkConfig
from cosmpy.aerial.wallet import LocalWallet
from cosmpy.crypto.keypairs import PrivateKey
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins

def initialize_wallet():
    MNEMONIC = os.environ.get('MNEMONIC')
    ADDRESS_PREFIX = os.environ.get('ADDRESS_PREFIX', 'osmo')

    if MNEMONIC is None or MNEMONIC.strip() == '':
        raise ValueError("Unable to initialize wallet: MNEMONIC environment variable is not set.")

    seed_bytes = Bip39SeedGenerator(MNEMONIC).Generate()
    bip44_def_ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.COSMOS).DeriveDefaultPath()
    wallet = LocalWallet(PrivateKey(bip44_def_ctx.PrivateKey().Raw().ToBytes()), prefix=ADDRESS_PREFIX)
    return wallet