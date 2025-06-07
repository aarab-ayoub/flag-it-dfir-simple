# Solution 1: Decrypting using the known key (0x4A)

def xor_decrypt(ciphertext, key):
    """
    Decrypt XOR encrypted data using the provided key.
    
    Args:
        ciphertext (bytes): The encrypted data
        key (int): The XOR key value (single byte)
        
    Returns:
        bytes: Decrypted data
    """
    return bytes([b ^ key for b in ciphertext])

def main():
    encrypted_file = "flag1_0x4A.txt.enc"
    
    key = 0x4A
    
    try:
        with open(encrypted_file, "rb") as f:
            data = f.read()
            
        ciphertext = data.split(b'\n')[1]
        
        plaintext = xor_decrypt(ciphertext, key)
        
        print(f"Decrypted with key 0x{key:X} ({key}):")
        print(plaintext.decode('utf-8'))
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()

# Solution 2: Brute forcing all possible XOR keys (0-255)

# with open("flag1_0x4A.txt.enc", "rb") as f:
#     data = f.read()

# found_flags = []

# for key in range(256):
#     decoded = bytes([b ^ key for b in data])
#     if b"MED{" in decoded:
#         flags = decoded.decode(errors="ignore").split("MED{")
#         for flag in flags[1:]:
#             if flag not in found_flags:
#                 found_flags.append((key, flag))
#                 print(f"Found potential flag with key {key}: {flag}")

# print("\n[+] All potential flags found:")
# for key, flag in found_flags:
#     print(f"Key: {key}, Flag: {flag}")