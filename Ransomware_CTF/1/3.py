# encrypt_pdf.py
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
import os

# Generate RSA keys (weak for CTF)
private_key = RSA.generate(1024) 
public_key = private_key.publickey()

# Encrypt PDF with AES
aes_key = get_random_bytes(32)
cipher_aes = AES.new(aes_key, AES.MODE_EAX)
with open("flag3.pdf", "rb") as f:
    pdf_data = f.read()
ciphertext, tag = cipher_aes.encrypt_and_digest(pdf_data)

# Encrypt AES key with RSA

# Why PKCS1_OAEP is Important
# Raw RSA encryption has several vulnerabilities:

# Deterministic output: Encrypting the same message twice produces identical ciphertexts
# Mathematical patterns: Pure RSA can leak information about the plaintext
# Malleability: An attacker might modify ciphertexts in meaningful ways
# How PKCS1_OAEP Works
# PKCS1_OAEP adds randomness and complexity to RSA encryption:

# It applies a random padding to the message
# Uses hash functions to mix the data thoroughly
# Ensures that encrypting the same data multiple times produces different ciphertexts

cipher_rsa = PKCS1_OAEP.new(public_key)
encrypted_aes_key = cipher_rsa.encrypt(aes_key)

# Save encrypted data
with open("flag3.pdf.enc", "wb") as f:
    [f.write(x) for x in (encrypted_aes_key, cipher_aes.nonce, tag, ciphertext)]

# Save private key to file (this will be hidden in slack space later)
with open("private_key.pem", "wb") as f:
    f.write(private_key.export_key())

print("PDF encrypted successfully!")
print("Flag3 part: MED{Slack_Space_Hunter}")
print("Private key saved to private_key.pem - this will be hidden in slack space")
