
import { apiRequest } from './client';

// Mock local storage and fetch as before...
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
    const email = `filtertest_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        console.log('--- Starting Filter & Delete Verification ---');

        // 1. Signup
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const authData = await signupRes.json();
        if (!authData.token) throw new Error('Signup failed');
        localStorage.setItem('token', authData.token);
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authData.token}` };

        // 2. Create Tasks (One TODAY, One TOMORROW)
        console.log('2. Creating Tasks...');
        const taskToday = await (await fetch('http://localhost:3000/api/tasks', {
            method: 'POST', headers,
            body: JSON.stringify({ title: 'Task Today', deadline: 'TODAY' })
        })).json();

        const taskTomorrow = await (await fetch('http://localhost:3000/api/tasks', {
            method: 'POST', headers,
            body: JSON.stringify({ title: 'Task Tomorrow', deadline: 'TOMORROW' })
        })).json();

        console.log('   Created:', taskToday.id, taskTomorrow.id);

        // 3. Filter TODAY
        console.log('3. Filtering deadline=TODAY...');
        const listToday = await (await fetch('http://localhost:3000/api/tasks?deadline=TODAY', { headers })).json();
        console.log('   Count:', listToday.length);
        if (listToday.length !== 1 || listToday[0].id !== taskToday.id) {
            console.error('FAILED: Filter returned wrong tasks:', listToday);
        } else {
            console.log('PASSED: Filter returned correct task.');
        }

        // 4. Delete Task
        console.log('4. Deleting "Task Today"...');
        const delRes = await fetch(`http://localhost:3000/api/tasks/${taskToday.id}`, { method: 'DELETE', headers });
        console.log('   Delete Status:', delRes.status);

        // 5. Verify Deletion
        console.log('5. Verifying Deletion (List TODAY again)...');
        const listAgain = await (await fetch('http://localhost:3000/api/tasks?deadline=TODAY', { headers })).json();
        console.log('   Count:', listAgain.length);
        if (listAgain.length !== 0) {
            console.error('FAILED: Task still visible after delete!');
        } else {
            console.log('PASSED: Task gone.');
        }

    } catch (e) {
        console.error(e);
    }
}

runTest();
