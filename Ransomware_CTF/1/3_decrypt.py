# decrypt_pdf.py
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA

def decrypt_pdf(encrypted_file, private_key_file, output_file):
    # Read the private key
    with open(private_key_file, 'rb') as f:
        private_key = RSA.import_key(f.read())
    
    # Read the encrypted data
    with open(encrypted_file, 'rb') as f:
        # The file format is:
        # [encrypted_aes_key][nonce][tag][ciphertext]
        encrypted_aes_key = f.read(private_key.size_in_bytes())
        nonce = f.read(16)
        tag = f.read(16)
        ciphertext = f.read()
    
    # Decrypt the AES key
    cipher_rsa = PKCS1_OAEP.new(private_key)
    aes_key = cipher_rsa.decrypt(encrypted_aes_key)
    
    # Decrypt the PDF data
    cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce)
    pdf_data = cipher_aes.decrypt_and_verify(ciphertext, tag)
    
    # Save the decrypted PDF
    with open(output_file, 'wb') as f:
        f.write(pdf_data)
    
    print(f"PDF decrypted successfully to {output_file}")

if __name__ == "__main__":
    try:
        decrypt_pdf('flag3.pdf.enc', 'private_key.pem', 'decrypted_flag3.pdf')
    except Exception as e:
        print(f"Error: {e}")
        print("Hint: The private key is hidden in slack space. Use forensic tools to extract it.")
