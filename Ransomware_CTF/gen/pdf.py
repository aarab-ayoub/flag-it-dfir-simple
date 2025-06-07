# encrypt_pdf.py
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes

private_key = RSA.generate(1024)
with open("private_key.pem", "wb") as f:
    f.write(private_key.export_key())

public_key = private_key.publickey()

aes_key = get_random_bytes(32)
cipher_aes = AES.new(aes_key, AES.MODE_EAX)
with open("flag3.pdf", "rb") as f: 
    pdf_data = f.read()
ciphertext, tag = cipher_aes.encrypt_and_digest(pdf_data)


cipher_rsa = PKCS1_OAEP.new(public_key)
encrypted_aes_key = cipher_rsa.encrypt(aes_key)

with open("flag3.pdf.enc", "wb") as f:
    [f.write(x) for x in (encrypted_aes_key, cipher_aes.nonce, tag, ciphertext)]

print("[+] Hybrid-encrypted flag3.pdf.enc created. RSA key in private_key.pem")
