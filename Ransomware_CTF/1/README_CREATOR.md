# Ransomware CTF Challenge Creator Guide

This guide explains how to set up and run the ransomware CTF challenge for DFIR training.

## Prerequisites

To create this challenge, you'll need:

1. Linux system with the following tools installed:
   - Python 3 with PyCryptodome library (`pip install pycryptodome`)
   - Bash shell
   - `dd` utility (typically pre-installed on Linux)
   - Filesystem tools (`mkfs.ext4`)
   - Root privileges (for mounting/unmounting)

## Challenge Creation Steps

### Step 1: Generate the Encrypted Files

1. Run the encryption scripts:
   ```bash
   cd /path/to/Ransomware_CTF/1/
   python3 1.py   # Creates XOR encrypted file (flag1_0x4A.txt.enc)
   python3 2.py   # Creates AES encrypted file (flag2.txt.enc)
   python3 3.py   # Creates hybrid-encrypted PDF file (flag3.pdf.enc) and private_key.pem
   ```

### Step 2: Create the Disk Image

1. Make the disk image creation script executable:
   ```bash
   chmod +x create_disk_image.sh
   ```

2. Run the script (requires sudo permissions):
   ```bash
   sudo ./create_disk_image.sh
   ```

   This will:
   - Create a 100MB disk image file named `ransomware_ctf_disk.img`
   - Format it with ext4 filesystem
   - Add the encrypted files and decoy files
   - Hide the AES password in a deleted file and in strings
   - Hide the RSA private key in slack space
   - Add a ransomware note

3. The final disk image `ransomware_ctf_disk.img` is ready for analysis with FTK Imager or other forensic tools.

## Challenge Distribution

1. Provide the `ransomware_ctf_disk.img` file to the participants
2. Include the challenge description:
   ```
   A small business employee accidentally ran a ransomware executable. Critical files were encrypted, 
   but the attacker left behind traces. As a DFIR team, analyze the disk, recover the encrypted files,
   and find the hidden flag (split into 3 parts).
   ```

## Solution

Refer to `writeup.md` for the complete solution guide.

## Flag

The complete flag is: `MED{Metadata_Expert_File_Carving_Pro_Slack_Space_Hunter}`

## Notes for Instructors

- If participants get stuck on the XOR part, hint that they should look at the filename and file content
- For the AES part, hint about looking for strings with "hint" or "password" in the disk image
- For the PDF part, suggest examining slack space of the decoy.txt file

## Files in This Challenge

- **Encryption Scripts**:
  - `1.py` - XOR encryption for flag1
  - `2.py` - AES encryption for flag2
  - `3.py` - Hybrid encryption for flag3.pdf

- **Decryption Scripts** (Solution):
  - `1_decrypt.py` - XOR decryption
  - `2_decrypt.py` - AES decryption
  - `3_decrypt.py` - Hybrid decryption for PDF

- **Challenge Creation**:
  - `create_disk_image.sh` - Creates the disk image with all files
  - `writeup.md` - Solution guide
  - `README_CREATOR.md` - This file

- **Encrypted Files**:
  - `flag1_0x4A.txt.enc`
  - `flag2.txt.enc`
  - `flag3.pdf.enc`

## Customization

To change the flags:
1. Edit the plaintext in each encryption script (1.py, 2.py, 3.py)
2. Run the scripts again to generate new encrypted files
3. Re-create the disk image with the new files
