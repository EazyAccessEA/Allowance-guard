"""
Generate blog featured images via Runware API — v3 (Nano Banana 2).

Model: google:2@1 (Nano Banana 2) — Google's high-quality model.
No steps param, no negativePrompt — model handles these internally.
Dimensions: 1408x768 (closest 16:9-ish ratio supported).

Council #27 + #28 prompt rules:
  One subject, name the material, name the lighting, name the background.
  Max 30 words. Warm amber + cream tones.
"""

import asyncio
import os
import uuid
import httpx

API_KEY = os.environ.get("RUNWARE_API_KEY", "iCSzmgzsJNF1Z3dpITcEDdrLPzD3odWp")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "images", "blog")

BLOG_IMAGES = [
    {
        "filename": "open-source-stronger-our-license-update.webp",
        "prompt": "A brushed gold open padlock lying on its side on a clean cream surface, soft studio lighting, warm amber tones, shallow depth of field",
    },
    {
        "filename": "hardware-wallets-and-multisigs.webp",
        "prompt": "A sleek matte black hardware wallet device standing upright on a cream surface, warm amber side-light, product photography, shallow depth of field",
    },
    {
        "filename": "understanding-smart-contract-risk.webp",
        "prompt": "A translucent glass cube with a visible crack running through it, warm studio lighting on cream background, editorial product shot",
    },
    {
        "filename": "building-your-personal-web3-security-routine.webp",
        "prompt": "A neat row of three small security tools — a magnifying glass, a small shield, and a key — arranged on cream paper, overhead soft lighting",
    },
    {
        "filename": "gas-fees-and-revocations.webp",
        "prompt": "A single Ethereum diamond logo rendered in polished amber glass, sitting on a clean white surface, soft warm studio light from above",
    },
    {
        "filename": "understanding-layer-2-networks.webp",
        "prompt": "Three thin glass layers stacked with slight offset, amber light passing through them, clean white background, minimal, architectural",
    },
    {
        "filename": "red-team-yourself.webp",
        "prompt": "A chess knight piece in dark metal next to one in brushed gold, facing each other on a cream surface, dramatic side-light, shallow depth of field",
    },
    {
        "filename": "programmable-safety.webp",
        "prompt": "A set of interlocking brass gears arranged in a precise pattern on cream paper, warm overhead lighting, engineering diagram aesthetic",
    },
    {
        "filename": "staying-safe-with-defi-dapps.webp",
        "prompt": "A glowing amber connect button floating above a clean white surface, soft reflection below, minimal, UI element as physical object",
    },
    {
        "filename": "how-to-self-audit-your-wallet.webp",
        "prompt": "An open leather-bound ledger book with amber bookmark ribbon, on a cream desk surface, warm natural window light from left side",
    },
    {
        "filename": "what-are-token-allowances.webp",
        "prompt": "A formal wax seal stamp next to a pressed seal on cream paper, amber wax, overhead soft lighting, editorial still life",
    },
    {
        "filename": "from-dapp-user-to-security-advocate.webp",
        "prompt": "A single small shield casting a long protective shadow over a row of smaller objects, warm side-light, cream background, minimal",
    },
    {
        "filename": "permit2-and-eip-2612.webp",
        "prompt": "A fountain pen signing a glowing digital document floating above a desk, warm amber light, cream background, editorial",
    },
    {
        "filename": "anatomy-of-an-approval-exploit.webp",
        "prompt": "A chain with one broken link lying on a dark surface, amber spotlight illuminating the break, dramatic contrast, forensic photography",
    },
    {
        "filename": "cross-chain-security-bridging.webp",
        "prompt": "A minimalist bridge structure made of amber glass connecting two stone platforms, clean grey background, architectural model photography",
    },
    {
        "filename": "why-we-open-sourced.webp",
        "prompt": "A transparent glass box with visible internal mechanisms, sitting on a cream surface, warm amber backlighting, product photography",
    },
    {
        "filename": "non-technical-guide-to-approvals.webp",
        "prompt": "A simple dashboard card with a green checkmark and amber gauge rendered as a physical object on a cream desk, soft overhead light",
    },
    {
        "filename": "account-abstraction-future-of-approvals.webp",
        "prompt": "A modern smart card with a glowing circuit pattern sitting upright on a cream surface, warm amber side-light, product photography, shallow depth of field",
    },
    {
        "filename": "why-most-wallet-security-tools-fail.webp",
        "prompt": "A broken magnifying glass lying next to an intact one on a cream surface, warm studio lighting, editorial still life, shallow depth of field",
    },
    {
        "filename": "eight-approval-exploits-one-pattern.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, row of dominoes tipping in sequence, first domino in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "every-approval-you-sign-decoded.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a key splitting into four differently shaped keys, one key in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "ten-minute-wallet-audit.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a simple stopwatch with the minute hand drawn in warm amber, centered, simple elegant, editorial spot illustration",
    },
]


async def generate_image(client: httpx.AsyncClient, item: dict, sem: asyncio.Semaphore):
    async with sem:
        # Skip if the output already exists. Saves Runware quota on re-runs
        # and makes this script safe to execute whenever a new entry is
        # added below — the operator deletes a specific file to re-roll it.
        filepath = os.path.join(OUTPUT_DIR, item["filename"])
        if os.path.exists(filepath):
            print(f"  SKIP: {item['filename']} (already generated)")
            return

        payload = [
            {
                "taskType": "imageInference",
                "taskUUID": str(uuid.uuid4()),
                "positivePrompt": item["prompt"],
                "model": "google:2@1",
                "width": 1408,
                "height": 768,
                "numberResults": 1,
                "outputFormat": "WEBP",
                "outputType": "URL",
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

            image_url = None
            if isinstance(data, dict) and "data" in data:
                for result in data["data"]:
                    if "imageURL" in result:
                        image_url = result["imageURL"]
                        break

            if not image_url:
                print(f"  ERROR: No imageURL for {item['filename']}: {data}")
                return

            img_resp = await client.get(image_url, timeout=60.0)
            img_resp.raise_for_status()

            with open(filepath, "wb") as f:
                f.write(img_resp.content)

            size_kb = len(img_resp.content) / 1024
            print(f"  OK: {item['filename']} ({size_kb:.0f}KB)")

        except Exception as e:
            print(f"  FAIL: {item['filename']} — {e}")


async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Generating {len(BLOG_IMAGES)} images — Nano Banana 2 (google:2@1)")
    print(f"Output: {OUTPUT_DIR}\n")

    sem = asyncio.Semaphore(3)
    async with httpx.AsyncClient() as client:
        tasks = [generate_image(client, item, sem) for item in BLOG_IMAGES]
        await asyncio.gather(*tasks)

    print(f"\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
