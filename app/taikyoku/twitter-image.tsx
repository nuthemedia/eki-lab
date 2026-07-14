import {
  renderTaikyokuSocialImage,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_SIZE,
} from "./metadata-art";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderTaikyokuSocialImage();
}
