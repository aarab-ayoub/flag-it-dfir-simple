# aes_encrypt.py
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os

password = "weakpass123"  # Weak password
key = pad(password.encode(), AES.block_size)  # Derive key
cipher = AES.new(key, AES.MODE_ECB)

plaintext = "FLAG_PART_2: File_Carving_Pro"

# Encrypt
encrypted = cipher.encrypt(pad(plaintext.encode(), AES.block_size))

# Create hint file then delete it
with open(".aes_hint.tmp", "w") as f:
    f.write(f"Password: {password}")
    
with open("flag2.txt.enc", "wb") as f:
    f.write(encrypted)

# Delete the hint file
os.remove(".aes_hint.tmp")
