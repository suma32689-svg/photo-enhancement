import sys
import types
import os
import cv2
import numpy as np

# ==========================================
# Compatibility fix for torchvision
# ==========================================

import torchvision.transforms.functional as F

functional_tensor = types.ModuleType(
    "torchvision.transforms.functional_tensor"
)

functional_tensor.rgb_to_grayscale = F.rgb_to_grayscale

sys.modules[
    "torchvision.transforms.functional_tensor"
] = functional_tensor

# ==========================================
# GFPGAN
# ==========================================

from gfpgan import GFPGANer

# ==========================================
# Paths
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

input_image = os.path.join(
    BASE_DIR,
    "old-photo.jpg"
)

model_path = os.path.join(
    BASE_DIR,
    "GFPGANv1.3.pth"
)

output_folder = os.path.join(
    BASE_DIR,
    "restored"
)

os.makedirs(output_folder, exist_ok=True)

# ==========================================
# Check input
# ==========================================

if not os.path.exists(input_image):
    print("ERROR: old-photo.jpg was not found.")
    sys.exit(1)

# ==========================================
# Load image
# ==========================================

print("Loading original photo...")

original = cv2.imread(input_image)

if original is None:
    print("ERROR: Could not read the image.")
    sys.exit(1)

# ==========================================
# STEP 1
# Detect and remove white cracks
# ==========================================

print("Detecting scratches and cracks...")

gray = cv2.cvtColor(
    original,
    cv2.COLOR_BGR2GRAY
)

# ------------------------------------------
# Detect bright thin scratches
# ------------------------------------------

kernel = cv2.getStructuringElement(
    cv2.MORPH_RECT,
    (15, 15)
)

tophat = cv2.morphologyEx(
    gray,
    cv2.MORPH_TOPHAT,
    kernel
)

mask1 = cv2.threshold(
    tophat,
    25,
    255,
    cv2.THRESH_BINARY
)[1]

# ------------------------------------------
# Detect long horizontal cracks
# ------------------------------------------

horizontal_kernel = cv2.getStructuringElement(
    cv2.MORPH_RECT,
    (25, 3)
)

horizontal = cv2.morphologyEx(
    gray,
    cv2.MORPH_TOPHAT,
    horizontal_kernel
)

mask2 = cv2.threshold(
    horizontal,
    20,
    255,
    cv2.THRESH_BINARY
)[1]

# ------------------------------------------
# Detect long vertical/diagonal-like damage
# ------------------------------------------

vertical_kernel = cv2.getStructuringElement(
    cv2.MORPH_RECT,
    (3, 25)
)

vertical = cv2.morphologyEx(
    gray,
    cv2.MORPH_TOPHAT,
    vertical_kernel
)

mask3 = cv2.threshold(
    vertical,
    20,
    255,
    cv2.THRESH_BINARY
)[1]

# ------------------------------------------
# Combine masks
# ------------------------------------------

scratch_mask = cv2.bitwise_or(
    mask1,
    mask2
)

scratch_mask = cv2.bitwise_or(
    scratch_mask,
    mask3
)

# ------------------------------------------
# Connect broken parts of scratches
# ------------------------------------------

connect_kernel = cv2.getStructuringElement(
    cv2.MORPH_ELLIPSE,
    (3, 3)
)

scratch_mask = cv2.dilate(
    scratch_mask,
    connect_kernel,
    iterations=1
)

# Remove tiny noise
scratch_mask = cv2.morphologyEx(
    scratch_mask,
    cv2.MORPH_OPEN,
    connect_kernel
)

# ------------------------------------------
# Inpaint damaged areas
# ------------------------------------------

print("Removing white cracks and scratches...")

clean_image = cv2.inpaint(
    original,
    scratch_mask,
    5,
    cv2.INPAINT_TELEA
)

# ==========================================
# Save intermediate image
# ==========================================

clean_path = os.path.join(
    output_folder,
    "scratch-removed.jpg"
)

cv2.imwrite(
    clean_path,
    clean_image
)

print("Scratch removal completed!")

# ==========================================
# STEP 2
# Load GFPGAN
# ==========================================

print("Loading GFPGAN model...")

restorer = GFPGANer(
    model_path=model_path,
    upscale=2,
    arch="clean",
    channel_multiplier=2,
    bg_upsampler=None
)

print("GFPGAN model loaded successfully!")

# ==========================================
# STEP 3
# Restore faces
# ==========================================

print("Restoring face and improving details...")

cropped_faces, restored_faces, restored_img = restorer.enhance(
    clean_image,
    has_aligned=False,
    only_center_face=False,
    paste_back=True
)

# ==========================================
# STEP 4
# Save final image
# ==========================================

output_path = os.path.join(
    output_folder,
    "restored-photo.jpg"
)

cv2.imwrite(
    output_path,
    restored_img
)

print()
print("===================================")
print("PHOTO ENHANCEMENT COMPLETED!")
print("===================================")
print()
print("Scratch removed:")
print(clean_path)
print()
print("Final enhanced image:")
print(output_path)
print()
print("===================================")