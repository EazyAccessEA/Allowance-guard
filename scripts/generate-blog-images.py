"""
Generate blog featured images via Runware API — v4 (Imagen 4.0 Preview).

Model: google:4@1 (Imagen 4.0 Preview).
Dimensions: 1344x768 (closest 16:9 Imagen 4 supports; allowed set is
  1024x1024, 1248x832, 1184x864, 896x1152, 1344x768, 1536x672, etc.).

=====================================================================
STYLE RULE — DO NOT DRIFT. Read before editing anything below.
=====================================================================

Every AllowanceGuard blog hero renders as editorial line-art on a
plain near-white field with one element in warm amber. The whole
existing catalogue on disk (padlock, chess knights, gears, broken
chain, bridge, clipboard, dominoes, keys, stopwatch, flag, paper
airplane, etc.) shares this aesthetic.

HOW IT ACTUALLY WORKS — investigated and verified 2026-04-19
---------------------------------------------------------------------
The Runware Usage dashboard at runware.ai/usage shows the true
history: all 154 successful generations on 2026-04-13 that produced
the shipped catalogue used model "Imagen 4.0 Preview" (google:4@1).
Not FLUX 1.1 Pro, not Nano Banana 2 — both of which earlier versions
of this script were mis-configured for. Commits claiming those
models never actually produced shipped images.

The prompt shape that Imagen 4 requires for line-art output is the
EXPLICIT RECIPE:

  "minimal line art illustration, single continuous thin black ink
   stroke on plain white background, no shading, no fill, [SUBJECT
   with one element in warm amber], centered, simple elegant,
   editorial spot illustration"

The recipe is not redundant window-dressing. It is a direct lookup
into the region of Imagen 4's training corpus tagged with editorial-
illustration / vector-spot-art examples. Drop the recipe and Imagen
4 returns photorealism. Council breakdown of why each clause earns
its place:

  #25 AI image director
    Model: google:4@1 at 1344x768. Imagen 4 Preview has a heavy
    concentration of editorial-illustration training data indexed
    under these exact phrases; the recipe is a latent-space
    coordinate, not decoration.

  #27 Senior prompt engineer (concrete subject, composition)
    [SUBJECT] must be ONE concrete noun plus ONE amber element.
    8-12 words max. "a key splitting into four keys, one in amber"
    parses. "an ancient chest of varied keys, one gold" does not —
    scene-building produces cluttered output.

  #28 Senior prompt engineer (brand systems, colour consistency)
    "warm amber" is the locked colour phrase. "golden", "orange",
    "bronze" drift the hue away from the brand. "no shading, no
    fill" disables Imagen's default mid-grey fills — dropping those
    negations muddies the amber accent.

  #29 Art Director (series cohesion)
    "editorial spot illustration" is the cue that produces the
    standalone-editorial-mark composition with the horizontal anchor
    line at the base. Drop "spot illustration" and you get composed
    scenes; keep it and you get the editorial marks that read as a
    set across the catalogue.

Rules for the [SUBJECT]:
  - One subject. Concrete noun. Visually distinct from existing
    catalogue (avoid second gear / second chain / second padlock).
  - Embed the amber accent INSIDE the subject:
    "a domino tipping, rendered in warm amber" >
    "a domino tipping with amber accent".
  - Keep it short — a clause, not a paragraph. The recipe prefix
    does the heavy lifting; the subject just names the thing.

DO NOT drop the recipe prefix. The prompts in this script WITHOUT
the recipe produced photoreal 3D on both Nano Banana 2 and Imagen 4
in 2026-04-19 testing.

DO NOT switch the model without regenerating the entire catalogue
and verifying visual cohesion end-to-end. Previous model switches
(to FLUX, to Nano Banana 2) were logged in commits but never
actually reflected in shipped imagery, because regeneration was
either skipped or silently failed.

Runware 504 watch: FLUX 1.1 Pro (runware:5@1) has been returning
504 Gateway Timeouts on Runware inference as of 2026-04-19. Do not
fall back to FLUX without confirming it's healthy.

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
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, three parallel horizontal layers stacked with a slight offset on a baseline, the middle layer drawn in warm amber ink, centered, simple elegant, editorial spot illustration",
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
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a fountain pen signing a paper document on a baseline, the signature stroke drawn in warm amber ink, centered, simple elegant, editorial spot illustration",
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
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, four different keys lying horizontally in a row on a baseline, the second key drawn in warm amber ink, centered, simple elegant, editorial spot illustration",
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
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, a paper airplane flying left to right above a continuous horizontal trail line, one wing drawn in warm amber ink, centered, simple elegant, editorial spot illustration",
    },
    {
        "filename": "four-lenses-on-an-unknown-contract.webp",
        "prompt": "minimal line art illustration, single continuous thin black ink stroke on plain white background, no shading, no fill, four interlocking magnifying lens rings of decreasing size arranged on a baseline, the innermost ring drawn in warm amber ink, centered, simple elegant, editorial spot illustration",
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
                "model": "google:4@1",
                "width": 1344,
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
