"""
CLI-style tests for the AI engine. Run with: python test_ai_engine.py
Demonstrates repeat evaluation, roleplay prompt retrieval, and roleplay evaluation.
"""

import json
import sys

# Ensure model-service is on path when run from project root or model-service
import os
_sys_path = os.path.dirname(os.path.abspath(__file__))
if _sys_path not in sys.path:
    sys.path.insert(0, _sys_path)

from ai_engine import (
    evaluate_repeat,
    evaluate_roleplay,
    get_roleplay_prompt,
    normalize_transcript,
)


def _print_section(title: str) -> None:
    print()
    print("=" * 60)
    print(title)
    print("=" * 60)


def _print_result(label: str, obj: dict) -> None:
    print(f"\n--- {label} ---")
    print(json.dumps(obj, indent=2))


def run_tests() -> None:
    """Run demo tests and print outputs for terminal demo."""
    _print_section("1. Repeat evaluation – correct phrase")
    result = evaluate_repeat("I need help.", "I need help.")
    _print_result("evaluate_repeat('I need help.', 'I need help.')", result)

    _print_section("2. Repeat evaluation – close phrase")
    result = evaluate_repeat("I need some help", "I need help.")
    _print_result("evaluate_repeat('I need some help', 'I need help.')", result)

    _print_section("3. Roleplay prompt retrieval")
    prompt_cleaning = get_roleplay_prompt("cleaning_job", 0)
    _print_result("get_roleplay_prompt('cleaning_job', 0)", prompt_cleaning)
    prompt_grocery = get_roleplay_prompt("grocery_store", 1)
    _print_result("get_roleplay_prompt('grocery_store', 1)", prompt_grocery)

    _print_section("4. Roleplay evaluation – cleaning_job step 0")
    result = evaluate_roleplay("I will clean table 4.", "cleaning_job", 0)
    _print_result(
        "evaluate_roleplay('I will clean table 4.', 'cleaning_job', 0)",
        result,
    )

    _print_section("5. Roleplay evaluation – grocery_store step 1")
    result = evaluate_roleplay("Yes please.", "grocery_store", 1)
    _print_result(
        "evaluate_roleplay('Yes please.', 'grocery_store', 1)",
        result,
    )

    _print_section("Helper: normalize_transcript")
    print("\nnormalize_transcript('  I   need   HELP  ') ->", repr(normalize_transcript("  I   need   HELP  ")))
    print("normalize_transcript('') ->", repr(normalize_transcript("")))

    print()
    print("Done. All demo tests completed.")
    print()


if __name__ == "__main__":
    try:
        run_tests()
    except RuntimeError as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print("Unexpected error:", e, file=sys.stderr)
        raise
