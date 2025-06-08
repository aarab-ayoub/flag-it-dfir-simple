#!/bin/bash
# create_disk_image.sh
# Creates a disk image with the CTF challenge files

# Set the size of the disk image (500MB)
IMAGE_SIZE="100M"
IMAGE_NAME="ransomware_ctf_disk.img"
MOUNT_POINT="/mnt/ctf_image"

echo "Creating disk image for CTF challenge..."

# Create a blank disk image
dd if=/dev/zero of=$IMAGE_NAME bs=1M count=100

# Create a filesystem on the image
mkfs.ext4 $IMAGE_NAME

# Create mount point if it doesn't exist
sudo mkdir -p $MOUNT_POINT

# Mount the image
sudo mount -o loop $IMAGE_NAME $MOUNT_POINT

# Create directory structure
sudo mkdir -p $MOUNT_POINT/important_files
sudo mkdir -p $MOUNT_POINT/personal
sudo mkdir -p $MOUNT_POINT/work

# Copy the encrypted files
echo "Adding encrypted flag files..."
sudo cp flag1_0x4A.txt.enc $MOUNT_POINT/important_files/
sudo cp flag2.txt.enc $MOUNT_POINT/important_files/
sudo cp flag3.pdf.enc $MOUNT_POINT/important_files/

# Create the ransomware note
cat > ransom_note.txt << EOL
======== RANSOMWARE NOTICE ========

YOUR FILES HAVE BEEN ENCRYPTED!

To recover your files, you need to:
1. Pay 1 BTC to address: 1MED5CryptoM3dium5Wallet789
2. Email your transaction ID to totally-not-ransomware@example.com

You have 48 hours to comply or your files will be permanently lost.

======== SYSTEM INFO ========
Encryption: Military-grade
Files affected: All personal and work documents
EOL

sudo cp ransom_note.txt $MOUNT_POINT/RANSOMWARE_README.txt

# Add some decoy files
echo "Creating decoy files..."
# Create a text file with some content
cat > notes.txt << EOL
Meeting notes - June 5, 2025
- Discuss quarterly targets
- Budget approval for new project
- Team building event planning
EOL
sudo cp notes.txt $MOUNT_POINT/work/

# Add the hint file for AES decryption (will be deleted but recoverable)
# Create a more substantial file to ensure it remains recoverable
cat > aes_hint.txt << EOL
==== SECURITY NOTE ====
This file contains sensitive information and should be deleted after use.
DO NOT SHARE THIS INFORMATION!

Password for encrypted files: weakpass123

Date: June 8, 2025
EOL

# Copy it to the image with a hidden name
sudo cp aes_hint.txt $MOUNT_POINT/.aes_hint.tmp

# Create a substantial amount of additional files to prevent overwriting
for i in {1..10}; do
    echo "Dummy file $i" | sudo tee $MOUNT_POINT/dummy_file_$i > /dev/null
done

# Now delete the hint file (but it should remain recoverable with file carving)
sudo rm $MOUNT_POINT/.aes_hint.tmp

# Write the string directly into the disk to ensure it can be found with strings
echo "HINT_WEAKPASS123_HINT" | sudo dd of=$MOUNT_POINT/personal/notes.txt conv=notrunc

# Add the private key to slack space
echo "Hiding RSA private key in slack space..."

# First method: Use file slack space
# Create a small file to have slack space
echo "This is just a decoy file" | sudo tee $MOUNT_POINT/decoy.txt > /dev/null

# Append the private key after the file end marker to simulate slack space
cat private_key.pem | sudo dd of=$MOUNT_POINT/decoy.txt bs=1 seek=24 conv=notrunc

# Second method: Create a file with the private key in a hidden directory and then delete it
sudo mkdir -p $MOUNT_POINT/.hidden_data
sudo cp private_key.pem $MOUNT_POINT/.hidden_data/rsa_key.pem
sudo rm $MOUNT_POINT/.hidden_data/rsa_key.pem

# Create the file with unallocated space that contains part of the key
echo "-----BEGIN RSA PRIVATE KEY-----" | sudo tee $MOUNT_POINT/key_hint.txt > /dev/null

# Unmount the image
echo "Finalizing disk image..."
sudo umount $MOUNT_POINT || echo "Note: already unmounted"

echo "Disk image created: $IMAGE_NAME"
echo "This disk image can now be analyzed with FTK Imager or other forensic tools."

# Cleanup
rm -f ransom_note.txt notes.txt aes_hint.txt
