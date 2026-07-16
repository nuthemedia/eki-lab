import {
  HEXAGRAM_SOCIAL_CONTENT_TYPE,
  HEXAGRAM_SOCIAL_SIZE,
  renderHexagramIndexSocialImage,
} from "./metadata-art";

export const alt = "易経・六十四卦辞典";
export const size = HEXAGRAM_SOCIAL_SIZE;
export const contentType = HEXAGRAM_SOCIAL_CONTENT_TYPE;

export default function Image() {
  return renderHexagramIndexSocialImage();
}
