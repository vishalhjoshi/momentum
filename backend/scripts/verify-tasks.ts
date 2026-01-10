
import { apiRequest } from './client';

// Mock local storage for the test script
const storage: Record<string, string> = {};
global.localStorage = {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { },
    key: () => null,
    length: 0
};

// Mock fetch by using a real fetch polyfill or just assume we run this in an environment with fetch
// For this script to run via `tsx`, we need to ensure fetch is available. Node 18+ has fetch.

// Helper to print step results
const log = (step: string, result: any) => console.log(`[${step}]`, JSON.stringify(result, null, 2));

async function runTest() {
    const email = `tasktest_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        console.log('--- Starting Task API Verification ---');

        // 1. Signup
        console.log('1. Signing up...');
        const signupRes = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const authData = await signupRes.json();

        if (!authData.token) throw new Error('Failed to signup: ' + JSON.stringify(authData));
        localStorage.setItem('token', authData.token);
        console.log('   Signup successful. Token acquired.');

        // 2. Create Task
        console.log('2. Creating Task...');
        const createData = {
            title: 'Test Task',
            description: 'This is a test task',
            deadline: 'TODAY',
            status: 'PENDING'
        };

        // We need to implement a simple authenticated fetch wrapper similar to client.ts
        const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        const createRes = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify(createData)
        });
        const task = await createRes.json();
        log('Create Task', task);

        // 3. List Tasks
        console.log('3. Listing Tasks...');
        const listRes = await fetch('http://localhost:3000/api/tasks', { headers: authHeaders });
        const tasks = await listRes.json();
        console.log(`   Fetched ${tasks.length} tasks.`);

        // 4. Update Task
        console.log('4. Updating Task...');
        const updateRes = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'PATCH',
            headers: authHeaders,
            body: JSON.stringify({ status: 'COMPLETED' })
        });
        const updatedTask = await updateRes.json();
        log('Update Task', updatedTask);

        // 5. Delete Task
        console.log('5. Deleting Task...');
        const deleteRes = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
            method: 'DELETE',
            headers: authHeaders
        });

        if (deleteRes.status === 204) {
            console.log('   Delete successful (204).');
        } else {
            console.log('   Delete failed:', deleteRes.status);
        }

        console.log('--- Verification Complete ---');

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTest();
