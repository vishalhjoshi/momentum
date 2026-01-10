


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
    const email = `analyticstest_${Date.now()}@example.com`;
    const password = 'password123';
    const today = new Date().toISOString().split('T')[0];

    try {
        console.log('--- Starting Analytics Verification ---');

        // 1. Signup
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const authData = await signupRes.json();
        if (!authData.token) throw new Error('Signup failed');
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` };

        // 2. Create and Complete Tasks
        console.log(`2. Creating Tasks...`);
        // Task 1: Created and Completed Today
        const t1 = await (await fetch('http://localhost:3000/api/tasks', {
            method: 'POST', headers, body: JSON.stringify({ title: 'Task 1', deadline: 'TODAY' })
        })).json();
        await fetch(`http://localhost:3000/api/tasks/${t1.id}`, {
            method: 'PATCH', headers, body: JSON.stringify({ status: 'COMPLETED' })
        });

        // Task 2: Created Today, Pending
        await fetch('http://localhost:3000/api/tasks', {
            method: 'POST', headers, body: JSON.stringify({ title: 'Task 2', deadline: 'TODAY' })
        });

        // 3. Create Journal Entry (Mood)
        console.log(`3. Creating Journal Entry...`);
        await fetch('http://localhost:3000/api/journal', {
            method: 'POST', headers,
            body: JSON.stringify({ content: 'Stats day', mood: 'GREAT', energy: 10, date: today })
        });

        // 4. Fetch Analytics
        console.log('4. Fetching Analytics Summary...');
        const stats = await (await fetch('http://localhost:3000/api/analytics/summary', { headers })).json();
        console.log('STATS:', JSON.stringify(stats, null, 2));

        // Checks
        if (stats.streak !== 1) console.error('FAILED: Streak should be 1');
        else console.log('PASSED: Streak is 1');

        if (stats.completionRate !== 50) console.error(`FAILED: Completion Rate should be 50%, got ${stats.completionRate}%`); // 1 of 2 tasks
        else console.log('PASSED: Completion Rate is 50%');

        if (stats.moodTrend.length !== 1) console.error('FAILED: Trend length mismatch');
        else console.log('PASSED: Mood Trend found.');

    } catch (e) {
        console.error(e);
    }
}

runTest();
