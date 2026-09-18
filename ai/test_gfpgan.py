import sys
import types

# Compatibility fix for newer torchvision
import torchvision.transforms.functional as F

functional_tensor = types.ModuleType(
    "torchvision.transforms.functional_tensor"
)
functional_tensor.rgb_to_grayscale = F.rgb_to_grayscale

sys.modules[
    "torchvision.transforms.functional_tensor"
] = functional_tensor

from gfpgan import GFPGANer

print("GFPGAN imported successfully!")