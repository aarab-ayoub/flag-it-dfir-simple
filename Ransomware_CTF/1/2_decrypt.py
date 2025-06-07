# decrypt_aes.py
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def decrypt_aes(encrypted_file, password, output_file=None):
    """
    Decrypt AES encrypted file using the provided password.
    
    Args:
        encrypted_file (str): Path to the encrypted file
        password (str): Password used for encryption
        output_file (str, optional): Output file path for decrypted content
    """
    # Derive key from password
    key = password.encode()
    # Pad the key to AES block size if needed
    key = key.ljust(16, b'\0')[:16]
    
    # Create cipher
    cipher = AES.new(key, AES.MODE_ECB)
    
    # Read encrypted data
    with open(encrypted_file, 'rb') as f:
        ciphertext = f.read()
    
    # Decrypt
    try:
        plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
        
        # Save to file if output_file is provided
        if output_file:
            with open(output_file, 'wb') as f:
                f.write(plaintext)
        
        return plaintext.decode('utf-8')
    except Exception as e:
        return f"Decryption error: {str(e)}"

if __name__ == "__main__":
    passwords_to_try = ["weakpass123", "123456", "password", "admin"]
    
    for password in passwords_to_try:
        print(f"Trying password: {password}")
        result = decrypt_aes('flag2.txt.enc', password)
        if "FLAG_PART_2" in result:
            print("Success! Decrypted content:")
            print(result)
            break
    else:
        print("Could not decrypt with the tried passwords.")
        print("Hint: The password is in a deleted .hint file. Use file carving tools.")
