from cosmpy.aerial.client import LedgerClient
from cosmpy.aerial.config import NetworkConfig

from config import CHAIN_ID, REST_NODE, DENOM

def initialize_ledger_client():
    try:
        cfg = NetworkConfig(
            chain_id=CHAIN_ID,
            url=f"rest+{REST_NODE}",
            fee_minimum_gas_price=.0025,
            fee_denomination=DENOM,
            staking_denomination=DENOM,
        )

        ledger_client = LedgerClient(cfg)
        return ledger_client
    except Exception as e:
        print(f"Error setting up LedgerClient: {e}")
        # raise an exception if configuration fails
        raise
