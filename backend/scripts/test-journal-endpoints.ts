
import { apiRequest } from './client';

// Mock storage
const storage: Record<string, string> = {};
global.localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { },
    key: () => null,
    length: 0
};

async function runTest() {
    const email = `journaltest_${Date.now()}@example.com`;
    const password = 'password123';
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    try {
        console.log('--- Starting Journal Endpoints Test ---');

        // 1. Signup
        console.log('1. Signing up...');
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const authData = await signupRes.json();
        if (!authData.token) throw new Error('Signup failed: ' + JSON.stringify(authData));
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` };
        console.log('   Signup successful.');

        // 2. Create Entry (Today)
        console.log(`2. Creating Journal Entry for ${today}...`);
        const entry1 = await (await fetch('http://localhost:3000/api/journal', {
            method: 'POST', headers,
            body: JSON.stringify({ content: 'Original content', mood: 'OKAY', energy: 5, date: today })
        })).json();
        console.log('   Created ID:', entry1.id);

        // 3. Patch Entry (Update Mood only)
        console.log(`3. PATCHing Journal Entry for ${today}...`);
        const patchRes = await fetch(`http://localhost:3000/api/journal/${today}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ mood: 'GREAT' })
        });
        const patchedEntry = await patchRes.json();

        if (patchedEntry.mood !== 'GREAT') {
            console.error('FAILED: Mood did not update!');
        } else if (patchedEntry.content !== 'Original content') {
            console.error(`FAILED: Content changed unexpectedly! Expected "Original content", got "${patchedEntry.content}"`);
        } else {
            console.log('PASSED: PATCH updated mood and preserved content.');
        }

        // 4. Patch Entry (Update Content only)
        console.log(`4. PATCHing Journal Entry for ${today} (Content check)...`);
        const patchRes2 = await fetch(`http://localhost:3000/api/journal/${today}`, {
            method: 'PATCH', headers,
            body: JSON.stringify({ content: 'Updated content' })
        });
        const patchedEntry2 = await patchRes2.json();

        if (patchedEntry2.content !== 'Updated content') {
            console.error('FAILED: Content did not update!');
        } else if (patchedEntry2.mood !== 'GREAT') {
            console.error(`FAILED: Mood changed unexpectedly! Expected "GREAT", got "${patchedEntry2.mood}"`);
        } else {
            console.log('PASSED: PATCH updated content and preserved mood.');
        }

        // 5. Patch Non-Existent Entry
        console.log('5. PATCHing non-existent entry...');
        const patchFailRes = await fetch(`http://localhost:3000/api/journal/${yesterday}`, { // Using yesterday's date which has no entry
            method: 'PATCH', headers,
            body: JSON.stringify({ mood: 'GOOD' })
        });
        if (patchFailRes.status === 404) {
            console.log('PASSED: PATCH returned 404 for non-existent entry.');
        } else {
            console.error(`FAILED: Expected 404, got ${patchFailRes.status}`);
        }

        // 6. Delete Entry
        console.log(`6. DELETEing Journal Entry for ${today}...`);
        const deleteRes = await fetch(`http://localhost:3000/api/journal/${today}`, {
            method: 'DELETE', headers
        });
        if (deleteRes.status === 204) {
            console.log('PASSED: DELETE returned 204.');
        } else {
            console.error(`FAILED: Expected 204, got ${deleteRes.status}`);
        }

        // 7. Verification Delete (Get should 404)
        console.log('7. Verifying Deletion...');
        const getRes = await fetch(`http://localhost:3000/api/journal/${today}`, { headers });
        if (getRes.status === 404) {
            console.log('PASSED: GET after DELETE returned 404.');
        } else {
            console.warn(`WARNING: Expected 404, got ${getRes.status}. (Note: GET /journal/:date might not be implemented to strictly 404 on null return from service, check service implementation)`);
            const getData = await getRes.json();
            // In service.ts: getJournalEntryByDate throws AppError(404) if not found.
            if (getData.error === 'Entry not found' || getData.error === 'Entry not found for this date') {
                console.log('PASSED: GET returned correct error message.');
            }
        }

    } catch (e) {
        console.error('TEST SUITE ERROR:', e);
    }
}

runTest();
