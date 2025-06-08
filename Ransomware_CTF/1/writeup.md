# Ransomware CTF Challenge Writeup

## Challenge Description

A small business employee accidentally ran a ransomware executable (`malware.exe`). Critical files were encrypted, but the attacker left behind traces. As a DFIR (Digital Forensics & Incident Response) team, you must analyze the disk, recover the encrypted files, and find the hidden flag (split into 3 parts).

## Solution Guide

### Step 1: Acquire and Mount the Disk Image

Using FTK Imager:
1. Open FTK Imager
2. File > Add Evidence Item > Select "Image File" > Navigate to `ransomware_ctf_disk.img`
3. Explore the disk structure

You can also use command-line tools to analyze the disk:
```bash
# List all files in the disk image
sudo fls ransomware_ctf_disk.img
```

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

Result: `FLAG_PART_1: MED{Metadata_Expert_`

### Step 4: Recover Flag Part 2 (AES Encryption)

1. Look for the password using multiple forensic methods:

   ```bash
   # Method 1: Search for deleted files
   sudo fls -rd ransomware_ctf_disk.img
   
   # Method 2: Use file carving to recover deleted files
   sudo foremost -t txt -i ransomware_ctf_disk.img -o recovered_files
   
   # Method 3: Search for strings containing "password" or "weak"
   sudo strings ransomware_ctf_disk.img | grep -i "HINT_WEAK"
   ```

2. Find the password "weakpass123" hidden in the disk:
   - It can be found using strings: `HINT_WEAKPASS123_HINT`
   - Or in a deleted file `.aes_hint.tmp`

3. Decrypt the AES encrypted file using the same padding and key derivation method as the encryption:

   ```python
   from Crypto.Cipher import AES
   from Crypto.Util.Padding import unpad, pad
   
   # Use the exact same key derivation as in the encryption
   password = "weakpass123"
   key = pad(password.encode(), AES.block_size)
   
   # Create cipher object with ECB mode
   cipher = AES.new(key, AES.MODE_ECB)
   
   with open("flag2.txt.enc", "rb") as f:
       ciphertext = f.read()
   
   # Decrypt and unpad
   decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)
   print(decrypted.decode('utf-8'))
   ```

Result: `FLAG_PART_2: File_Carving_Pro_`

### Step 5: Recover Flag Part 3 (Hybrid Encryption)

1. The PDF is encrypted with a hybrid encryption scheme:
   - The PDF data is encrypted with AES
   - The AES key is encrypted with RSA
   - Need to find the RSA private key to decrypt

2. Look for the RSA private key hidden in slack space:

   ```bash
   # Find the decoy.txt file
   sudo fls ransomware_ctf_disk.img | grep -i "decoy"
   
   # Extract the slack space from decoy.txt (replace XX with the inode number)
   sudo icat ransomware_ctf_disk.img XX > recovered_key.pem
   
   # Check if it contains the private key
   strings recovered_key.pem | grep "BEGIN RSA PRIVATE KEY"
   ```

3. Alternatively, search for the private key directly:

   ```bash
   # Search for the RSA private key header
   sudo strings ransomware_ctf_disk.img | grep -A 5 "BEGIN RSA PRIVATE KEY"
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
- String analysis tools: `strings`, `grep` for finding hidden information

## Learning Outcomes

This challenge teaches several important skills in digital forensics:

1. **Metadata examination**: Looking for clues in file names and headers
2. **File recovery**: Finding and recovering deleted files from disk images
3. **Advanced data hiding**: Discovering data hidden in slack space
4. **Cryptographic analysis**: Understanding and breaking different encryption methods
5. **Forensic tooling**: Using industry-standard forensic tools
