# encrypt_xor.py
def xor_encrypt(text, key):
    return bytes([b ^ key for b in text.encode()])

text = "FLAG_PART_1: MED{Hello_Crypto"  # Replace with your actual flag part
key = 0x4A  # Simple key (hex)
encrypted = xor_encrypt(text, key)

with open("flag1.txt.enc", "wb") as f:
    f.write(encrypted)

print(f"[+] XOR-encrypted flag1.txt.enc created. Key: {hex(key)}")