"""
Generate blog featured images via Runware API — v3 (Nano Banana 2).

Model: google:2@1 (Nano Banana 2).
Dimensions: 1408x768.

=====================================================================
STYLE RULE — DO NOT DRIFT. Read before editing anything below.
=====================================================================

Every AllowanceGuard blog hero renders as editorial line-art on a
plain near-white field with one element in warm amber. This is the
house style and must stay cohesive across the catalogue.

TWO PATHS exist to this line-art aesthetic; historically the catalogue
has used both:

  (A) FLUX 1.1 Pro (runware:5@1) + product-shot prose prompts.
      FLUX has a strong editorial-illustration prior. Given prompts
      like "brushed gold padlock on cream surface, product
      photography", FLUX draws rather than photographs. The older
      ~19 images on disk (padlock, chess knights, gears, broken
      chain, bridge, clipboard, etc.) were generated this way.

  (B) Nano Banana 2 (google:2@1) + explicit line-art recipe.
      Nano Banana 2 has no such prior — product-shot prompts produce
      literal 3D photorealism. To get line-art from Nano Banana 2,
      the prompt MUST include the explicit recipe prefix:
      "minimal line art illustration, single continuous thin black
      ink stroke on plain white background, no shading, no fill,
      [SUBJECT with amber element], centered, simple elegant,
      editorial spot illustration". The 5 most recent line-art images
      (dominoes, four keys, stopwatch, flag, paper airplane) use
      path B.

We use PATH B going forward:
  - Nano Banana 2 is currently healthier on Runware than FLUX (which
    has been returning 504 Gateway Timeouts on FLUX inference).
  - The explicit recipe gives us deterministic control — new entries
    don't depend on a model-specific prior staying the same over
    future Runware updates.
  - Mixing paths is fine for the existing catalogue (the two paths
    produce visually-cohesive output), but new entries should pick
    one and stick to it. Path B is that one.

ALWAYS use this prompt shape (Council #25 + #27 + #28 + #29):

  "minimal line art illustration, single continuous thin black ink
   stroke on plain white background, no shading, no fill, [SUBJECT
   with one element in warm amber], centered, simple elegant,
   editorial spot illustration"

Rules for the [SUBJECT]:
  - One subject. Concrete noun. Distinct from existing catalogue
    (avoid second gear / second chain / second padlock).
  - Embed the amber accent INSIDE the subject:
    "a domino tipping, rendered in warm amber" >
    "a domino tipping with amber accent".
  - Keep the subject short — a clause, not a paragraph. The recipe
    prefix is doing the heavy lifting; the subject just names the
    thing.

DO NOT drop the recipe prefix when using Nano Banana 2. Doing so
produces photorealism, which breaks the catalogue cohesion.

DO NOT switch the model without regenerating the entire catalogue
and verifying visual cohesion end-to-end.

Council sign-off (advisory, convene mentally before adding prompts):
  #25 AI image director   — prompt engineering, model selection
  #27 Senior prompt eng   — concrete subject, composition
  #28 Senior prompt eng   — brand-colour consistency across series
  #29 Art Director        — series cohesion, rejects anything that
                            breaks the set

Drift means re-roll; Runware quota is finite. Get the prompt right
on paper first.
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
    {
        "filename": "report-a-risky-contract.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a small flag planted on a hill with the flag itself in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "the-quiet-death-of-approve.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a paper airplane in flight with a dotted trail behind it, the airplane rendered in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "four-lenses-on-an-unknown-contract.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a magnifying glass with four overlapping concentric lens rings, the innermost lens rendered in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "how-to-revoke-a-permit2-approval.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a pencil eraser rubbing out a handwritten signature line, the eraser rendered in warm amber, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "the-six-wallets-of-2026.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, six small billfold wallets standing upright in a neat row, the third wallet rendered in warm amber, centered, simple elegant, editorial spot illustration",
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
