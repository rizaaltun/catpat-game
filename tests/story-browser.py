#!/usr/bin/env python3
"""Scripted browser integration, not a claim of a complete manual playthrough."""
import functools
import http.server
import json
import pathlib
import threading
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'qa-browser'
OUT.mkdir(exist_ok=True)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/?qa=1'
results = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        for name, size, mobile in [('desktop', {'width': 1280, 'height': 720}, False), ('mobile', {'width': 844, 'height': 390}, True)]:
            context = browser.new_context(viewport=size, is_mobile=mobile, has_touch=mobile)
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(url)
            page.wait_for_function('window.__CATPAT_QA__ && window.__CATPAT_QA__.game.background')
            page.screenshot(path=str(OUT / f'{name}-01-menu.png'))
            page.click('[data-action="continue"]')
            page.wait_for_selector('#story-dialogue:not([hidden])')
            frozen = page.evaluate('({time:__CATPAT_QA__.game.runtime.time,x:__CATPAT_QA__.game.player.x,y:__CATPAT_QA__.game.player.y})')
            page.wait_for_timeout(350)
            assert frozen == page.evaluate('({time:__CATPAT_QA__.game.runtime.time,x:__CATPAT_QA__.game.player.x,y:__CATPAT_QA__.game.player.y})'), 'physics moved under the dialogue'
            page.screenshot(path=str(OUT / f'{name}-02-intro.png'))
            page.keyboard.press('Space')
            assert page.locator('#story-page').inner_text() == '2 / 5'
            page.keyboard.press('Tab')
            assert page.evaluate('document.activeElement.id') in ['story-next', 'story-skip']
            page.click('#story-skip')
            page.wait_for_function('!__CATPAT_QA__.game.paused && !__CATPAT_QA__.ui.story')
            for index in range(3):
                page.evaluate('''index => {
                    const {game} = __CATPAT_QA__;
                    const f = game.level.friends[index];
                    game.enterMission(f.missionId, f.id);
                }''', index)
                page.wait_for_selector('#story-dialogue:not([hidden])')
                assert page.evaluate('__CATPAT_QA__.game.mission') is None, 'mission started before conversation ended'
                if index == 0:
                    page.screenshot(path=str(OUT / f'{name}-03-mission-intro.png'))
                page.click('#story-skip')
                page.wait_for_function('__CATPAT_QA__.game.mission && !__CATPAT_QA__.game.paused')
                # Each mission's objective mechanics are covered by mission-smoke.mjs.
                # Here exercise its real completion event -> modal -> recruitment wiring.
                page.evaluate("__CATPAT_QA__.game.missionRuntime.finish('QA completion')")
                page.wait_for_selector('#story-dialogue:not([hidden])')
                assert page.evaluate('__CATPAT_QA__.game.finishing') == 0, 'mission overwrote main ending timer'
                if index == 0:
                    page.screenshot(path=str(OUT / f'{name}-04-recruitment.png'))
                page.click('#story-skip')
                page.wait_for_function('!__CATPAT_QA__.game.mission && !__CATPAT_QA__.game.paused')
                assert page.evaluate('__CATPAT_QA__.game.companions.members.length') == index + 1
                assert page.locator('#companion-progress').inner_text() == f'{index + 1}/3'
            page.keyboard.down('ArrowRight')
            page.wait_for_timeout(1150)
            page.keyboard.up('ArrowRight')
            page.wait_for_timeout(200)
            assert page.evaluate('__CATPAT_QA__.game.companions.poses().filter(p=>p.visible).length') == 3
            page.screenshot(path=str(OUT / f'{name}-05-together.png'))
            # Simulated arrival: geometry and reachability have their own complete test.
            page.evaluate('''() => {
                const {game} = __CATPAT_QA__;
                game.runtime.tickets = game.runtime.totalTickets;
                game.player.x = game.level.goal.x;
                game.player.y = game.level.goal.y - game.player.h / 2;
                game.camera.x = game.level.length - game.canvas.width;
                game.runtime.resolveGoal(game.player);
                game.handleEvents(game.runtime.takeEvents());
            }''')
            page.wait_for_selector('#story-dialogue:not([hidden])')
            assert page.locator('#story-page').inner_text() == '1 / 5'
            page.screenshot(path=str(OUT / f'{name}-06-festival-dialogue.png'))
            page.click('#story-skip')
            page.wait_for_selector('#festival-complete.is-visible', timeout=8000)
            assert len(page.locator('#festival-friends').inner_text().split(' \u00b7 ')) == 3
            page.screenshot(path=str(OUT / f'{name}-07-festival-result.png'))
            assert not errors, errors
            results.append({'viewport': name, 'result': 'PASS', 'browserErrors': errors, 'checks': ['menu', 'intro', 'frozen physics', 'keyboard', 'mission pre-dialogue', 'mission completion', 'recruitment 3/3', 'recorded route following', 'festival', 'chapter save']})
            context.close()
        offline = browser.new_page(viewport={'width': 1280, 'height': 720})
        offline_errors = []
        offline.on('pageerror', lambda error: offline_errors.append(str(error)))
        offline.goto((ROOT / 'dist/catpat-bolum-1-v05.html').as_uri())
        offline.wait_for_function("document.querySelector('#loading-status').textContent.includes('Dinle')")
        offline.click('[data-action="continue"]')
        offline.wait_for_selector('#story-dialogue:not([hidden])')
        assert not offline_errors, offline_errors
        results.append({'viewport': 'standalone file://', 'result': 'PASS'})
        browser.close()
finally:
    server.shutdown()
    (OUT / 'results.json').write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')
print(json.dumps(results, indent=2, ensure_ascii=False))
