import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');

const createStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
  };
};

let server;
let LandingAuthActions;
let AuthContext;
let navigationHelpers;

before(async () => {
  global.window = {
    location: { protocol: 'http:', hostname: 'localhost' },
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {},
  };
  server = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });
  LandingAuthActions = (
    await server.ssrLoadModule('/src/components/LandingAuthActions.jsx')
  ).default;
  AuthContext = (await server.ssrLoadModule('/src/context/AuthContext.jsx')).AuthContext;
  navigationHelpers = await server.ssrLoadModule('/src/lib/authNavigation.js');
});

after(async () => {
  await server?.close();
  delete global.window;
});

const renderLandingAuth = (user, props = {}) =>
  renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(
        AuthContext.Provider,
        { value: { user, token: 'test-token', logout() {} } },
        React.createElement(LandingAuthActions, {
          isAr: false,
          loginTone: '',
          ctaTone: '',
          ...props,
        })
      )
    )
  );

test('A - Admin Home navigation preserves the session and logout remains explicit', () => {
  const source = readSource('src/components/admin/AdminLayout.jsx');
  const homeLink = source.match(/<Link\s+to="\/"[\s\S]*?<\/Link>/)?.[0];
  assert.ok(homeLink, 'Admin layout must contain a Home link');
  assert.match(homeLink, /navigationOnlyClick\(event, \[onNavigate\]\)/);
  assert.doesNotMatch(
    homeLink,
    /logout|clearSession|setUser|setToken|removeItem|navigate\(['"]\/login['"]\)/
  );
  assert.match(
    source,
    /const handleLogout[\s\S]*?logout\(\)[\s\S]*?navigate\(['"]\/login['"]\)/
  );
});

test('B - Student Home navigation preserves the session and logout remains explicit', () => {
  const source = readSource('src/components/Navbar.jsx');
  const homeHandler = source.match(
    /const handleHomeNavigation = \(event\) => \{[\s\S]*?\n  \};/
  )?.[0];
  assert.ok(homeHandler, 'Navbar must contain a Home handler');
  assert.match(homeHandler, /navigationOnlyClick\(event, \[[\s\S]*?setProfileDropdownOpen[\s\S]*?setMobileMenuOpen[\s\S]*?\]\)/);
  assert.doesNotMatch(
    homeHandler,
    /logout|clearSession|setUser|setToken|removeItem|navigate\(/
  );
  assert.match(source, /item\.to === ['"]\/['"] \? handleHomeNavigation : undefined/);
  assert.match(
    source,
    /const handleLogout[\s\S]*?logout\(\)[\s\S]*?navigate\(['"]\/login['"]\)/
  );
});

test('navigationOnlyClick stops propagation and only runs supplied callbacks', () => {
  let stopped = false;
  const calls = [];
  navigationHelpers.navigationOnlyClick(
    { stopPropagation() { stopped = true; } },
    [
      () => calls.push('first'),
      () => calls.push('second'),
    ]
  );
  assert.equal(stopped, true);
  assert.deepEqual(calls, ['first', 'second']);
  assert.match(
    navigationHelpers.navigationOnlyClick.toString(),
    /event\?\.stopPropagation\?\.\(\)/
  );
  assert.doesNotMatch(
    navigationHelpers.navigationOnlyClick.toString(),
    /logout|clearSession|setUser|setToken|removeItem|navigate/
  );
});

test('C - Landing shows authenticated navigation after Home', () => {
  const adminHtml = renderLandingAuth({ role: 'admin', name: 'Ada' });
  assert.match(adminHtml, /href="\/admin"/);
  assert.match(adminHtml, /Admin panel/);
  assert.match(adminHtml, /My profile/);
  assert.doesNotMatch(adminHtml, /Log in|Sign up/);

  const studentHtml = renderLandingAuth({ role: 'student', name: 'Sam' });
  assert.match(studentHtml, /href="\/dashboard"/);
  assert.match(studentHtml, /Dashboard/);
  assert.match(studentHtml, /My profile/);
  assert.doesNotMatch(studentHtml, /Log in|Sign up/);

  const mobileHtml = renderLandingAuth(
    { role: 'admin', name: 'Ada' },
    { variant: 'mobile' }
  );
  assert.match(mobileHtml, /href="\/admin"/);
  assert.match(mobileHtml, /href="\/profile"/);
  assert.doesNotMatch(mobileHtml, /Log in|Sign up/);
});

test('D - Landing and dashboard return use one shared AuthProvider', () => {
  const main = readSource('src/main.jsx');
  const app = readSource('src/App.jsx');
  const guard = readSource('src/components/ProtectedRoute.jsx');
  const landing = readSource('src/pages/PublicLandingPage.jsx');

  assert.equal((main.match(/<AuthProvider>/g) || []).length, 1);
  assert.match(main, /<AuthProvider>[\s\S]*?<App \/>/);
  assert.match(app, /path="\/admin"[\s\S]*?requireAdmin=\{true\}[\s\S]*?<AdminLayout \/>/);
  assert.match(app, /<ProtectedRoute>[\s\S]*?<StudentLayout \/>[\s\S]*?<Route path="\/dashboard"/);
  assert.doesNotMatch(guard, /logout|clearSession|setUser|setToken|removeItem/);

  assert.match(landing, /const \{ user \} = useContext\(AuthContext\)/);
  assert.match(landing, /function LandingFooter\(\) \{[\s\S]*?const \{ user \} = useContext\(AuthContext\)/);
  assert.match(landing, /<LandingAuthActions isAr=\{isAr\} loginTone=\{loginTone\} ctaTone=\{ctaTone\} \/>/);
  assert.match(landing, /variant="mobile"/);
  assert.equal((landing.match(/to=\{user \? dashboardPath : '\/register'\}/g) || []).length, 2);
  assert.equal((landing.match(/<Link\s+to="\/register"/g) || []).length, 1);
});

test('E - Unauthenticated landing keeps login controls and explicit logout still clears', () => {
  const unauthHtml = renderLandingAuth(null);
  assert.match(unauthHtml, /href="\/login"/);
  assert.match(unauthHtml, /href="\/register"/);
  assert.match(unauthHtml, /Log in/);
  assert.match(unauthHtml, /Sign up/);

  const auth = readSource('src/context/AuthContext.jsx');
  const admin = readSource('src/components/admin/AdminLayout.jsx');
  const navbar = readSource('src/components/Navbar.jsx');
  assert.match(
    auth,
    /const clearSession = useCallback\(\(\) => \{[\s\S]*?setUser\(null\)[\s\S]*?setToken\(''\)[\s\S]*?clearStoredSession\(\)/
  );
  assert.match(auth, /const logout = \(\) => clearSession\(\);/);
  assert.match(admin, /const handleLogout[\s\S]*?logout\(\)/);
  assert.match(navbar, /const handleLogout[\s\S]*?logout\(\)/);
});
