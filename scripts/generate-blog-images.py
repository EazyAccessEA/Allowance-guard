"""
Generate blog featured images via Runware API.

Council #25 (AI Image Director) + #26 (Visual Brand Photographer):
- Style: Dark moody 3D conceptual renders with warm amber/gold accent lighting
- Matches Ledger palette: oxblood darks, amber highlights, paper warmth
- 1200x630 (OpenGraph optimal, 1.91:1 aspect ratio)
- WebP output for performance
- Conceptual, not literal — each image tells the story of the blog topic
"""

import asyncio
import os
import uuid
import httpx

API_KEY = os.environ.get("RUNWARE_API_KEY", "iCSzmgzsJNF1Z3dpITcEDdrLPzD3odWp")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "blog")

# Council #25 style system
STYLE_SUFFIX = (
    "dark moody cinematic 3D render, warm amber and gold accent lighting, "
    "deep oxblood and dark brown shadows, editorial quality, conceptual abstract, "
    "soft depth of field, professional product photography style, "
    "subtle paper texture overlay, high detail, 8k quality"
)
NEGATIVE = (
    "text, watermark, logo, cartoon, anime, low quality, blurry, stock photo, "
    "oversaturated, neon, bright colors, white background, people faces, hands"
)

# Council #25 + #26 prompt design per post
BLOG_IMAGES = [
    {
        "filename": "open-source-stronger-our-license-update.webp",
        "prompt": "An open padlock transforming into flowing source code streams, golden light emanating from the open lock, surrounded by interconnected nodes and network paths",
    },
    {
        "filename": "hardware-wallets-and-multisigs.webp",
        "prompt": "A sleek hardware security device floating above a glowing amber vault, multiple crystalline keys orbiting around it, digital security shields layered in depth",
    },
    {
        "filename": "understanding-smart-contract-risk.webp",
        "prompt": "A translucent glass smart contract document with visible cracks and fracture lines, amber warning light illuminating the flaws, layers of code visible beneath the surface",
    },
    {
        "filename": "building-your-personal-web3-security-routine.webp",
        "prompt": "A ritual arrangement of security tools on a dark surface: a shield, a magnifying glass, a clock, and a checklist, all rendered in amber-lit glass and metal",
    },
    {
        "filename": "gas-fees-and-revocations.webp",
        "prompt": "Ethereum gas flame being carefully controlled and optimized, flowing through efficient crystalline pipes, amber energy particles being compressed and refined",
    },
    {
        "filename": "understanding-layer-2-networks.webp",
        "prompt": "Multiple translucent blockchain layers stacked vertically with data flowing between them, the top layer glowing with amber efficiency, connected by light bridges",
    },
    {
        "filename": "red-team-yourself.webp",
        "prompt": "A chess board where one side plays both colors, a magnifying glass examining the dark pieces, amber light revealing hidden attack vectors and defensive positions",
    },
    {
        "filename": "programmable-safety.webp",
        "prompt": "An autonomous security system made of interlocking gears and circuits, self-adjusting mechanisms glowing with amber energy, protective barriers activating automatically",
    },
    {
        "filename": "staying-safe-with-defi-dapps.webp",
        "prompt": "A glowing connect wallet button floating in space with visible permission threads extending from it, some threads golden and safe, others red and dangerous",
    },
    {
        "filename": "how-to-self-audit-your-wallet.webp",
        "prompt": "An open digital wallet being examined under a warm amber spotlight, its contents organized and catalogued, approval documents floating around it in an orderly audit",
    },
    {
        "filename": "what-are-token-allowances.webp",
        "prompt": "A signed permission slip transforming into digital code, hovering above an open vault, golden approval stamps and revocation seals arranged around it",
    },
    {
        "filename": "from-dapp-user-to-security-advocate.webp",
        "prompt": "A single shield multiplying into many shields spreading outward in a network pattern, amber light connecting them, community protection growing from one source",
    },
    {
        "filename": "permit2-and-eip-2612.webp",
        "prompt": "A digital signature pen signing an ethereal document that dissolves into cryptographic particles, dual approval mechanisms shown as parallel golden pathways",
    },
    {
        "filename": "anatomy-of-an-approval-exploit.webp",
        "prompt": "A cross-section cutaway of a blockchain transaction revealing hidden malicious code inside, red warning indicators contrasting with amber protective barriers",
    },
    {
        "filename": "cross-chain-security-bridging.webp",
        "prompt": "Multiple blockchain islands connected by glowing bridges, one bridge showing structural vulnerabilities with amber warning lights, others standing strong and secure",
    },
    {
        "filename": "why-we-open-sourced.webp",
        "prompt": "A transparent glass building with all its internal machinery visible, golden light flowing through open doors, source code carved into the glass walls like an inscription",
    },
    {
        "filename": "non-technical-guide-to-approvals.webp",
        "prompt": "A simple dashboard interface rendered as a physical wooden desk with organized amber-lit cards, each card showing clear icons for risk levels, approvals, and actions",
    },
]


async def generate_image(client: httpx.AsyncClient, item: dict, sem: asyncio.Semaphore):
    """Generate a single image via Runware HTTP API."""
    async with sem:
        full_prompt = f"{item['prompt']}, {STYLE_SUFFIX}"
        payload = [
            {
                "taskType": "imageInference",
                "taskUUID": str(uuid.uuid4()),
                "positivePrompt": full_prompt,
                "negativePrompt": NEGATIVE,
                "model": "runware:101@1",  # FLUX Schnell — fast, high quality
                "width": 1216,  # closest to 1200 divisible by 64
                "height": 640,  # closest to 630 divisible by 64
                "numberResults": 1,
                "outputFormat": "WEBP",
                "outputType": "URL",
                "steps": 4,
            }
        ]

        print(f"  Generating: {item['filename']}...")
        try:
            resp = await client.post(
                "https://api.runware.ai/v1",
                json=payload,
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                timeout=120.0,
            )
            resp.raise_for_status()
            data = resp.json()

            # Extract image URL from response
            image_url = None
            if isinstance(data, dict) and "data" in data:
                for result in data["data"]:
                    if "imageURL" in result:
                        image_url = result["imageURL"]
                        break
            elif isinstance(data, list):
                for result in data:
                    if "imageURL" in result:
                        image_url = result["imageURL"]
                        break

            if not image_url:
                print(f"  ERROR: No imageURL in response for {item['filename']}: {data}")
                return

            # Download the image
            img_resp = await client.get(image_url, timeout=60.0)
            img_resp.raise_for_status()

            filepath = os.path.join(OUTPUT_DIR, item["filename"])
            with open(filepath, "wb") as f:
                f.write(img_resp.content)

            size_kb = len(img_resp.content) / 1024
            print(f"  OK: {item['filename']} ({size_kb:.0f}KB)")

        except Exception as e:
            print(f"  FAIL: {item['filename']} — {e}")


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(BLOG_IMAGES)} blog images via Runware...")
    print(f"Output: {OUTPUT_DIR}\n")

    sem = asyncio.Semaphore(4)  # max 4 concurrent requests
    async with httpx.AsyncClient() as client:
        tasks = [generate_image(client, item, sem) for item in BLOG_IMAGES]
        await asyncio.gather(*tasks)

    print(f"\nDone. Check {OUTPUT_DIR}/")


if __name__ == "__main__":
    asyncio.run(main())
