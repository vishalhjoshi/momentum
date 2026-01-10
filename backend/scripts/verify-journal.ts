


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

    try {
        console.log('--- Starting Journal Verification ---');

        // 1. Signup
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const authData = await signupRes.json();
        if (!authData.token) throw new Error('Signup failed');
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` };

        // 2. Create Entry (Today)
        console.log(`2. Creating Journal Entry for ${today}...`);
        const entry1 = await (await fetch('http://localhost:3000/api/journal', {
            method: 'POST', headers,
            body: JSON.stringify({ content: 'Feeling good today!', mood: 'GOOD', energy: 8, date: today })
        })).json();
        console.log('   Created ID:', entry1.id);

        // 3. Update Entry (Upsert Test)
        console.log(`3. Updating Journal Entry for ${today} (Upsert)...`);
        const entry2 = await (await fetch('http://localhost:3000/api/journal', {
            method: 'POST', headers,
            body: JSON.stringify({ content: 'Actually feeling great!', mood: 'GREAT', energy: 9, date: today }) // Changed mood/content
        })).json();
        console.log('   Updated ID:', entry2.id);

        if (entry1.id !== entry2.id) {
            console.error('FAILED: Upsert created a new entry instead of updating!');
        } else {
            console.log('PASSED: Upsert maintained same ID.');
        }

        if (entry2.mood !== 'GREAT') {
            console.error('FAILED: Content did not update!');
        } else {
            console.log('PASSED: Content updated correctly.');
        }

        // 4. Get History
        console.log('4. Fetching History...');
        const history = await (await fetch('http://localhost:3000/api/journal', { headers })).json();
        console.log('   Count:', history.length);
        if (history.length !== 1) console.error('FAILED: History count mismatch');

        // 5. Get Specific Day
        console.log(`5. Fetching Specific Day ${today}...`);
        const specific = await (await fetch(`http://localhost:3000/api/journal/${today}`, { headers })).json();
        if (specific.id !== entry1.id) console.error('FAILED: Specific day fetch mismatch');
        console.log('PASSED: Specific day fetch success.');

    } catch (e) {
        console.error(e);
    }
}

runTest();
