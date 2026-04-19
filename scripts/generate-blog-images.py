 """
Generate blog featured images via Runware API — v3 (Nano Banana 2).

Model: google:2@1 (Nano Banana 2) — Google's high-quality model.
No steps param, no negativePrompt — model handles these internally.
Dimensions: 1408x768 (closest 16:9-ish ratio supported).

=====================================================================
STYLE RULE — DO NOT DRIFT. Read before editing prompts.
=====================================================================

Every AllowanceGuard blog hero renders as editorial line-art on a
plain, near-white field with one element in warm amber. That is the
house style and has been since the Ledger redesign.

The line-art aesthetic comes from the MODEL'S PRIOR, not from the
prompt. Do NOT write prompts that explicitly ask for "line art",
"single continuous ink stroke", "no shading, no fill", "vector
illustration" etc. — those recipes over-specify and flatten the
composition. Nano Banana 2 renders product-photography prose as
line-art by default; the model will draw when asked to photograph.

ALWAYS use this prompt shape (Council #25 + #27 + #28 + #29):

  "[SUBJECT with MATERIAL] [on SURFACE/SETTING], [the specific detail
   rendered in warm amber], [LIGHTING], [editorial modifier]"

Rules:
  - One subject. Name the material. Name the lighting. Name the
    background. Keep it 20-30 words.
  - Embed the amber accent INSIDE the subject, not as a separate
    instruction. "the minute hand rendered in warm amber" >
    "with amber accent".
  - Editorial / product-photography adjectives only:
    "editorial still life", "shallow depth of field", "soft studio
    lighting", "cream surface", "overhead natural light", "product
    photography". These read to the model as "polished editorial
    reference" and the shortest path for the model is line-art.
  - Banned in prompts: "line art", "ink stroke", "vector", "minimalist
    illustration", "no fill", "no shading", "continuous stroke",
    "black ink on white", "spot illustration". The model handles the
    medium; you handle the subject.
  - Aim for visual distinctness from the existing catalogue — no two
    subjects should collapse into the same motif (e.g. avoid a second
    gear / second chain / second padlock).
  - Amber accent colour only. No other colours beyond black ink and
    amber.

Council sign-off (advisory, convene mentally before adding prompts):
  #25 AI image director   — prompt engineering, model selection
  #27 Senior prompt eng   — concrete subject, composition
  #28 Senior prompt eng   — brand-colour consistency across series
  #29 Art Director        — series cohesion, rejects anything that
                            breaks the set

Drift from this rule means the image has to be re-rolled; Runware
quota is finite, so get the prompt right on paper first.
=====================================================================
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
        "prompt": "A row of ivory dominoes arranged in a line on a cream surface, the first domino tipping forward and rendered in warm amber, soft overhead lighting, editorial still life",
    },
    {
        "filename": "every-approval-you-sign-decoded.webp",
        "prompt": "Four antique brass keys fanning out from a single ring on cream paper, the central key rendered in warm amber, soft overhead studio lighting, editorial product shot",
    },
    {
        "filename": "ten-minute-wallet-audit.webp",
        "prompt": "A vintage silver pocket stopwatch sitting on cream paper, the minute hand rendered in warm amber, soft natural light from the left, editorial still life, shallow depth of field",
    },
    {
        "filename": "report-a-risky-contract.webp",
        "prompt": "A small pennant flag mounted on a short pole planted in a gentle mound on a cream surface, the flag itself rendered in warm amber fabric, soft overhead lighting, editorial composition",
    },
    {
        "filename": "the-quiet-death-of-approve.webp",
        "prompt": "A folded paper airplane in mid-flight above a cream surface, a dashed trail following its path, the airplane rendered in warm amber paper, soft studio lighting, editorial product shot",
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
