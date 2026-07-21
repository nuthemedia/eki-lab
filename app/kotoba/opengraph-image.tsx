import {
  KOTOBA_SOCIAL_IMAGE_ALT,
  KOTOBA_SOCIAL_IMAGE_SIZE,
  renderKotobaSocialImage,
} from "./metadata-art";

export const alt = KOTOBA_SOCIAL_IMAGE_ALT;
export const size = KOTOBA_SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderKotobaSocialImage();
}
