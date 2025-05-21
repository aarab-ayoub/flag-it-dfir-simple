# encrypt_aes.py
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os

password = "weakpass123".encode()  # Weak password (CTF-friendly)
key = pad(password, AES.block_size)  # Derive 128-bit key
cipher = AES.new(key, AES.MODE_ECB)

plaintext = "FLAG_PART_2: Secure_Data"  # Your flag here

encrypted = cipher.encrypt(pad(plaintext.encode(), AES.block_size))
with open("flag2.txt.enc", "wb") as f:
    f.write(encrypted)

print("[+] AES-encrypted flag2.txt.enc created. Password: 'weakpass123'")
