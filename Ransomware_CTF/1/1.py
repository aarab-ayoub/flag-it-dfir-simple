# xor_encrypt.py
import os

def xor_encrypt(text, key):
    return bytes([b ^ key for b in text.encode()])

text = "FLAG_PART_1: MED{Metadata_Expert"
key = 0x4A  # Simple key (hex)

# Encrypt the flag
encrypted = xor_encrypt(text, key)

# Write to file with metadata hint
with open("flag1.txt.enc", "wb") as f:
    f.write(b"KEY_HINT: The XOR key is 0x4A (hex)\n")
    f.write(encrypted)

# Alternative method - include key in filename
os.rename("flag1.txt.enc", f"flag1_0x4A.txt.enc")