# decrypt_aes.py - AES decryption for flag2
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad, pad

def decrypt_flag2():
    """
    Decrypt flag2.txt.enc using the correct AES key derivation method.
    """
    # Password known from the disk image forensics
    password = "weakpass123"
    
    # Use the exact same key derivation as in the encryption script
    key = pad(password.encode(), AES.block_size)
    
    try:
        with open('flag2.txt.enc', 'rb') as f:
            encrypted_data = f.read()
        
        # Create cipher object with ECB mode (same as encryption)
        cipher = AES.new(key, AES.MODE_ECB)
        
        # Decrypt and unpad
        decrypted = unpad(cipher.decrypt(encrypted_data), AES.block_size)
        
        print("Successfully decrypted flag2.txt.enc!")
        print(decrypted.decode('utf-8'))
        return True
            
    except Exception as e:
        print(f"Error during decryption: {e}")
        return False

if __name__ == "__main__":
    print("Flag 2 Decryption Tool - AES")
    print("-----------------------------")
    print("This password was found through forensic analysis of the disk image")
    print("using strings command or file carving tools.")
    print("\nAttempting to decrypt flag2.txt.enc with password 'weakpass123'...")
    
    decrypt_flag2()
