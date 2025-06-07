# Ransomware CTF Challenge Writeup

## Challenge Description

A small business employee accidentally ran a ransomware executable (`malware.exe`). Critical files were encrypted, but the attacker left behind traces. As a DFIR (Digital Forensics & Incident Response) team, you must analyze the disk, recover the encrypted files, and find the hidden flag (split into 3 parts).

## Solution Guide

### Step 1: Acquire and Mount the Disk Image

Using FTK Imager:
1. Open FTK Imager
2. File > Add Evidence Item > Select "Image File" > Navigate to `ransomware_ctf_disk.img`
3. Explore the disk structure

### Step 2: Analyze the Encrypted Files

Three encrypted files are found in the `/important_files` directory:
- `flag1_0x4A.txt.enc`
- `flag2.txt.enc`
- `flag3.pdf.enc`

### Step 3: Recover Flag Part 1 (XOR Encryption)

1. Examine `flag1_0x4A.txt.enc`
2. Notice that the filename contains `0x4A` - this is the XOR key (in hexadecimal)
3. Additionally, the file contains a hint in its first line: `KEY_HINT: The XOR key is 0x4A (hex)`
4. Decrypt using XOR with key 0x4A (74 in decimal)

```python
def xor_decrypt(ciphertext, key):
    return bytes([b ^ key for b in ciphertext])

with open("flag1_0x4A.txt.enc", "rb") as f:
    data = f.read()
    
# Skip the first line (hint)
ciphertext = data.split(b'\n')[1]
    
# Decrypt with key 0x4A
plaintext = xor_decrypt(ciphertext, 0x4A)
print(plaintext.decode('utf-8'))
```

Result: `FLAG_PART_1: MED{Metadata_Expert`

### Step 4: Recover Flag Part 2 (AES Encryption)

1. Look for deleted files using file carving tools:
   ```
   foremost -i ransomware_ctf_disk.img -o recovered_files
   ```
   
2. Find the deleted `.aes_hint.tmp` file which contains the password: `weakpass123`

3. Decrypt the AES encrypted file:
   ```python
   from Crypto.Cipher import AES
   from Crypto.Util.Padding import unpad
   
   password = "weakpass123"
   key = password.encode().ljust(16, b'\0')[:16]  # Pad to 16 bytes
   cipher = AES.new(key, AES.MODE_ECB)
   
   with open("flag2.txt.enc", "rb") as f:
       ciphertext = f.read()
   
   plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
   print(plaintext.decode('utf-8'))
   ```

Result: `FLAG_PART_2: File_Carving_Pro`

### Step 5: Recover Flag Part 3 (Hybrid Encryption)

1. The PDF is encrypted with AES, and the AES key is encrypted with RSA
2. Need to find the RSA private key hidden in slack space
3. Use `sleuthkit` tools to examine slack space:
   ```
   fls -r ransomware_ctf_disk.img
   icat -s ransomware_ctf_disk.img [inode_of_decoy.txt] > recovered_key.pem
   ```
   
4. Decrypt the PDF using the recovered private key:
   ```python
   from Crypto.Cipher import AES, PKCS1_OAEP
   from Crypto.PublicKey import RSA
   
   # Read the private key
   with open("recovered_key.pem", 'rb') as f:
       private_key = RSA.import_key(f.read())
   
   # Read the encrypted data
   with open("flag3.pdf.enc", 'rb') as f:
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
   with open("decrypted_flag3.pdf", 'wb') as f:
       f.write(pdf_data)
   ```

5. Open the decrypted PDF to find: `FLAG_PART_3: Slack_Space_Hunter}`

### Step 6: Combine the Flag Parts

Final Flag: `MED{Metadata_Expert_File_Carving_Pro_Slack_Space_Hunter}`

## Techniques Demonstrated

1. **File Metadata Analysis**: Finding the XOR key in the filename and file content
2. **File Carving**: Recovering deleted files to find the AES password
3. **Slack Space Analysis**: Extracting hidden data from slack space
4. **Cryptography**:
   - XOR Decryption
   - AES Decryption
   - RSA/Hybrid Encryption Systems

## Tools Used

- FTK Imager: For disk image analysis
- Foremost/Scalpel: For file carving
- Sleuthkit (fls, icat): For filesystem analysis
- Python with PyCryptodome: For decryption operations
