def is_valid_osmosis_address(address: str) -> bool:
    if len(address) != 43 or not address.startswith("osmo"):
        return False

    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    for i in range(4, 43):
        if address[i] not in alphabet:
            return False
    return True