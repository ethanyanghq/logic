from __future__ import annotations

import os
import re
import time
from dataclasses import dataclass, field

from playwright.sync_api import Page, Playwright, expect, sync_playwright


BASE_URL = os.environ.get("T020_BASE_URL", "http://127.0.0.1:4173")
APP_TIMEOUT_MS = 2_000
BROWSER_CHANNEL = os.environ.get("T020_BROWSER_CHANNEL", "chrome")


@dataclass
class RuntimeAudit:
    console_errors: list[str] = field(default_factory=list)
    page_errors: list[str] = field(default_factory=list)

    def attach(self, page: Page) -> None:
        page.on(
            "console",
            lambda message: self.console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: self.page_errors.append(str(error)))

    def assert_clean(self) -> None:
        problems = []
        if self.console_errors:
            problems.append("Console errors:\n- " + "\n- ".join(self.console_errors))
        if self.page_errors:
            problems.append("Page errors:\n- " + "\n- ".join(self.page_errors))
        if problems:
            raise AssertionError("\n\n".join(problems))


def wait_for_fonts(page: Page) -> None:
    page.wait_for_load_state("domcontentloaded")
    page.evaluate(
        """
        async () => {
          await document.fonts.ready;
          return getComputedStyle(document.body).fontFamily;
        }
        """
    )
    font_family = page.evaluate("() => getComputedStyle(document.body).fontFamily")
    if "Geist" not in font_family:
        raise AssertionError(f"Unexpected body font family: {font_family}")


def launch_browser(playwright: Playwright):
    # Prefer the installed Chrome channel because the bundled Playwright Chromium
    # on this machine still routes through the deprecated old-headless path.
    return playwright.chromium.launch(channel=BROWSER_CHANNEL, headless=True)


def open_demo_controls(page: Page, *, via_shortcut: bool) -> None:
    dialog = page.get_by_role("dialog", name="Demo controls")
    if via_shortcut:
        page.keyboard.press("Meta+Shift+R")
        if not dialog.is_visible():
            page.keyboard.press("Control+Shift+R")
    else:
        page.get_by_role("button", name="Demo controls").click()
    expect(dialog).to_be_visible(timeout=APP_TIMEOUT_MS)


def question_option(page: Page, letter: str, *, interactive_only: bool = False):
    scope = (
        page.locator('[data-stage="selecting"]')
        if interactive_only
        else page.locator('[aria-label="Question"]')
    )
    return scope.get_by_role("radio", name=re.compile(rf"Option {letter}:"))


def close_demo_controls(page: Page) -> None:
    page.keyboard.press("Escape")
    expect(page.get_by_role("dialog", name="Demo controls")).not_to_be_visible(
        timeout=APP_TIMEOUT_MS
    )


def reset_to_first_launch(page: Page, *, via_shortcut: bool) -> None:
    open_demo_controls(page, via_shortcut=via_shortcut)
    page.get_by_role("button", name="Reset to first launch").click()
    page.get_by_role("button", name="Reset everything").click()
    expect(page.get_by_role("heading", name="Tune Logic to you")).to_be_visible(
        timeout=APP_TIMEOUT_MS
    )


def load_preset(page: Page, preset_name: str, expected_text: str) -> float:
    open_demo_controls(page, via_shortcut=True)
    start = time.perf_counter()
    page.get_by_role("button", name=preset_name).click()
    expect(page.get_by_text(expected_text)).to_be_visible(timeout=APP_TIMEOUT_MS)
    elapsed = time.perf_counter() - start
    if elapsed >= 2:
        raise AssertionError(f"Preset {preset_name} took {elapsed:.2f}s to load.")
    return elapsed


def check_desktop_frame_and_sticky_chrome(page: Page) -> None:
    metrics = page.evaluate(
        """
        () => {
          const main = document.querySelector('main');
          if (!main) {
            throw new Error('Missing main element');
          }
          return {
            windowWidth: window.innerWidth,
            mainWidth: main.getBoundingClientRect().width,
          };
        }
        """
    )
    if metrics["mainWidth"] >= metrics["windowWidth"] * 0.8:
        raise AssertionError(f"Desktop frame did not constrain width: {metrics}")

    status_bar = page.get_by_label("Status bar")
    main = page.locator("main")
    home_indicator = page.locator("main + div")
    status_box_before = status_bar.bounding_box()
    indicator_box_before = home_indicator.bounding_box()
    if not status_box_before or not indicator_box_before:
        raise AssertionError("Missing sticky chrome boxes for desktop check.")
    main.evaluate("(node) => { node.scrollTop = node.scrollHeight; }")
    page.wait_for_timeout(120)
    status_box_after = status_bar.bounding_box()
    indicator_box_after = home_indicator.bounding_box()
    if not status_box_after or not indicator_box_after:
        raise AssertionError("Sticky chrome disappeared after scroll.")
    if abs(status_box_before["y"] - status_box_after["y"]) > 1:
        raise AssertionError("Status bar shifted during scroll.")
    if abs(indicator_box_before["y"] - indicator_box_after["y"]) > 1:
        raise AssertionError("Home indicator shifted during scroll.")


def complete_onboarding(page: Page, *, display_name: str) -> None:
    open_demo_controls(page, via_shortcut=True)
    close_demo_controls(page)

    lsat_option = page.get_by_role("radio", name=re.compile("LSAT"))
    lsat_option.click()
    expect(page.get_by_label("Display name")).to_be_visible(timeout=APP_TIMEOUT_MS)

    name_input = page.get_by_label("Display name")
    name_input.fill(display_name)
    page.reload()
    expect(page.get_by_label("Display name")).to_have_value(display_name)
    page.get_by_role("button", name="Change goal").click()
    expect(page.get_by_role("radio", name=re.compile("LSAT"))).to_be_visible()
    page.get_by_role("radio", name=re.compile("GRE")).click()
    page.get_by_label("Display name").fill(display_name)
    page.get_by_role("button", name="Continue to home").click()
    expect(
        page.get_by_role(
            "heading", name=re.compile(rf"Good (morning|afternoon|evening), {display_name}")
        )
    ).to_be_visible(timeout=APP_TIMEOUT_MS)


def run_desktop_flow(playwright: Playwright) -> dict[str, float]:
    browser = launch_browser(playwright)
    audit = RuntimeAudit()
    timings: dict[str, float] = {}
    try:
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()
        audit.attach(page)
        page.goto(BASE_URL)
        wait_for_fonts(page)

        reset_to_first_launch(page, via_shortcut=True)
        complete_onboarding(page, display_name="Avery")

        check_desktop_frame_and_sticky_chrome(page)
        expect(page.get_by_text("Preview only")).to_have_count(3)
        open_demo_controls(page, via_shortcut=False)
        close_demo_controls(page)

        start_resume_button = page.get_by_role(
            "button", name=re.compile(r"(Start|Resume|Review) Foundations")
        )
        start_resume_button.click()
        expect(page.locator('[data-stage="skeleton"]')).to_be_visible(timeout=1_000)
        expect(page.get_by_role("button", name="Submit")).to_be_disabled()

        option_a = question_option(page, "A", interactive_only=True)
        option_a.click()
        page.get_by_role("button", name="Submit").click()
        expect(page.get_by_role("status")).to_contain_text("Correct")
        expect(page.get_by_text("Explanation")).to_be_visible()
        page.get_by_role("button", name="Continue").click()
        expect(page.get_by_text("2 / 5")).to_be_visible()

        open_demo_controls(page, via_shortcut=True)
        close_demo_controls(page)

        question_option(page, "A", interactive_only=True).click()
        page.reload()
        wait_for_fonts(page)
        page.get_by_role("button", name=re.compile(r"(Resume|Review) Foundations")).click()
        expect(page.get_by_text("2 / 5")).to_be_visible()
        selected_count = page.locator('[role="radio"][aria-checked="true"]').count()
        if selected_count != 1:
            raise AssertionError(f"Expected one persisted draft selection, found {selected_count}.")

        page.get_by_role("button", name="Exit question").click()
        expect(page.get_by_role("heading", name="Modules")).to_be_visible()

        timings["fresh-user"] = load_preset(page, "Fresh user", "Tune Logic to you")
        timings["mid-foundations"] = load_preset(page, "Mid-Foundations", "3 / 5")
        selected_count = page.locator('[role="radio"][aria-checked="true"]').count()
        if selected_count != 1:
            raise AssertionError("Mid-Foundations preset did not restore its saved draft state.")

        timings["completion-ready"] = load_preset(page, "Completion ready", "5 / 5")
        question_option(page, "A", interactive_only=True).click()
        page.get_by_role("button", name="Submit").click()
        expect(page.get_by_role("status")).to_contain_text("Correct")
        page.get_by_role("button", name="See completion").click()
        expect(page.get_by_role("heading", name="Foundations complete")).to_be_visible()

        open_demo_controls(page, via_shortcut=True)
        close_demo_controls(page)

        page.get_by_role("button", name="Back to home").click()
        expect(page.get_by_role("heading", name="Modules")).to_be_visible()

        timings["power-user"] = load_preset(page, "Power user", "Foundations complete")
        expect(page.get_by_text("L2").first).to_be_visible()

        reset_to_first_launch(page, via_shortcut=True)
        audit.assert_clean()
        context.close()
        return timings
    finally:
        browser.close()


def run_mobile_smoke(playwright: Playwright) -> None:
    browser = launch_browser(playwright)
    audit = RuntimeAudit()
    try:
        iphone = playwright.devices["iPhone 13"]
        context = browser.new_context(**iphone)
        page = context.new_page()
        audit.attach(page)
        page.goto(BASE_URL)
        wait_for_fonts(page)
        reset_to_first_launch(page, via_shortcut=True)
        metrics = page.evaluate(
            """
            () => {
              const main = document.querySelector('main');
              if (!main) {
                throw new Error('Missing main element');
              }
              return {
                windowWidth: window.innerWidth,
                mainWidth: main.getBoundingClientRect().width,
              };
            }
            """
        )
        if abs(metrics["mainWidth"] - metrics["windowWidth"]) > 8:
            raise AssertionError(f"Mobile edge-to-edge layout mismatch: {metrics}")
        expect(page.get_by_role("heading", name="Tune Logic to you")).to_be_visible()
        audit.assert_clean()
        context.close()
    finally:
        browser.close()


def main() -> None:
    with sync_playwright() as playwright:
        timings = run_desktop_flow(playwright)
        run_mobile_smoke(playwright)
    summary = ", ".join(f"{name}={elapsed:.2f}s" for name, elapsed in timings.items())
    print(f"T020 Playwright audit passed. Preset timings: {summary}")


if __name__ == "__main__":
    main()
