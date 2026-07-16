import { renderHexagramDetailSocialImage } from "@/app/(core)/hexagrams/metadata-art";

type RouteProps = { params: Promise<{ number: string }> };

export async function GET(_request: Request, { params }: RouteProps) {
  const { number: raw } = await params;
  const number = Number(raw);
  if (!Number.isInteger(number) || number < 1 || number > 64) {
    return new Response("Not found", { status: 404 });
  }
  return renderHexagramDetailSocialImage(number);
}
