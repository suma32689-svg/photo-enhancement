import sys
import os
import cv2
import numpy as np
import types
import torchvision.transforms.functional as F

# --------------------------------------------------
# GFPGAN compatibility fix
# --------------------------------------------------
functional_tensor = types.ModuleType(
    "torchvision.transforms.functional_tensor"
)
functional_tensor.rgb_to_grayscale = F.rgb_to_grayscale
sys.modules["torchvision.transforms.functional_tensor"] = functional_tensor

from gfpgan import GFPGANer


# --------------------------------------------------
# Check arguments
# --------------------------------------------------
if len(sys.argv) != 3:
    print("Usage:")
    print("python enhance_image.py <input> <output>")
    sys.exit(1)

input_path = os.path.abspath(sys.argv[1])
output_path = os.path.abspath(sys.argv[2])

print("========================================")
print("PHOTO ENHANCEMENT AI")
print("========================================")

print("Input :", input_path)
print("Output:", output_path)


# --------------------------------------------------
# Check input
# --------------------------------------------------
if not os.path.exists(input_path):
    print("ERROR: Input image not found.")
    sys.exit(1)


# --------------------------------------------------
# Read image
# --------------------------------------------------
image = cv2.imread(input_path)

if image is None:
    print("ERROR: Could not read input image.")
    sys.exit(1)

print("Original size:", image.shape[1], "x", image.shape[0])


# --------------------------------------------------
# STEP 1: Remove cracks / scratches
# --------------------------------------------------
print("Removing scratches and crack lines...")

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Detect bright thin lines
kernel_horizontal = cv2.getStructuringElement(
    cv2.MORPH_RECT, (31, 3)
)

kernel_vertical = cv2.getStructuringElement(
    cv2.MORPH_RECT, (3, 31)
)

horizontal = cv2.morphologyEx(
    gray,
    cv2.MORPH_TOPHAT,
    kernel_horizontal
)

vertical = cv2.morphologyEx(
    gray,
    cv2.MORPH_TOPHAT,
    kernel_vertical
)

# Combine both directions
scratch_mask = cv2.add(horizontal, vertical)

# Threshold
_, scratch_mask = cv2.threshold(
    scratch_mask,
    35,
    255,
    cv2.THRESH_BINARY
)

# Remove tiny noise
small_kernel = cv2.getStructuringElement(
    cv2.MORPH_RECT,
    (3, 3)
)

scratch_mask = cv2.morphologyEx(
    scratch_mask,
    cv2.MORPH_OPEN,
    small_kernel
)

# Make detected cracks slightly wider
scratch_mask = cv2.dilate(
    scratch_mask,
    np.ones((3, 3), np.uint8),
    iterations=1
)

# Inpaint scratches
clean_image = cv2.inpaint(
    image,
    scratch_mask,
    5,
    cv2.INPAINT_TELEA
)

print("Scratch removal completed.")


# --------------------------------------------------
# STEP 2: Improve overall image
# --------------------------------------------------
print("Improving overall image quality...")

# Gentle denoising
clean_image = cv2.fastNlMeansDenoisingColored(
    clean_image,
    None,
    5,
    5,
    7,
    21
)

# Improve local contrast
lab = cv2.cvtColor(
    clean_image,
    cv2.COLOR_BGR2LAB
)

l, a, b = cv2.split(lab)

clahe = cv2.createCLAHE(
    clipLimit=2.0,
    tileGridSize=(8, 8)
)

l = clahe.apply(l)

lab = cv2.merge((l, a, b))

enhanced_image = cv2.cvtColor(
    lab,
    cv2.COLOR_LAB2BGR
)

# Slight color improvement
hsv = cv2.cvtColor(
    enhanced_image,
    cv2.COLOR_BGR2HSV
)

h, s, v = cv2.split(hsv)

s = np.clip(
    s.astype(np.float32) * 1.08,
    0,
    255
).astype(np.uint8)

hsv = cv2.merge((h, s, v))

enhanced_image = cv2.cvtColor(
    hsv,
    cv2.COLOR_HSV2BGR
)


# --------------------------------------------------
# STEP 3: GFPGAN face restoration
# --------------------------------------------------
print("Running GFPGAN face restoration...")

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

model_path = os.path.join(
    BASE_DIR,
    "GFPGANv1.3.pth"
)

if not os.path.exists(model_path):
    print("ERROR: GFPGAN model not found:")
    print(model_path)
    sys.exit(1)


try:
    restorer = GFPGANer(
        model_path=model_path,
        upscale=2,
        arch="clean",
        channel_multiplier=2,
        bg_upsampler=None
    )

    cropped_faces, restored_faces, restored_image = (
        restorer.enhance(
            enhanced_image,
            has_aligned=False,
            only_center_face=False,
            paste_back=True
        )
    )

    final_image = restored_image

    print("GFPGAN restoration completed.")

except Exception as error:
    print("GFPGAN error:")
    print(error)
    print("Using enhanced image without face restoration.")

    final_image = enhanced_image


# --------------------------------------------------
# STEP 4: Final gentle sharpening
# --------------------------------------------------
print("Applying final image enhancement...")

blur = cv2.GaussianBlur(
    final_image,
    (0, 0),
    1.0
)

final_image = cv2.addWeighted(
    final_image,
    1.15,
    blur,
    -0.15,
    0
)


# --------------------------------------------------
# Create output directory
# --------------------------------------------------
output_directory = os.path.dirname(output_path)

if output_directory:
    os.makedirs(
        output_directory,
        exist_ok=True
    )


# --------------------------------------------------
# Save final image
# --------------------------------------------------
success = cv2.imwrite(
    output_path,
    final_image,
    [
        cv2.IMWRITE_JPEG_QUALITY,
        95
    ]
)

if not success:
    print("ERROR: Failed to save output image.")
    sys.exit(1)


# --------------------------------------------------
# Finished
# --------------------------------------------------
print("========================================")
print("PHOTO ENHANCEMENT COMPLETED!")
print("========================================")
print("Final image:")
print(output_path)