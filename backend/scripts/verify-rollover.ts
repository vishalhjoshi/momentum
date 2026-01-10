
import { prisma } from '../src/lib/prisma'
import { runDailyRollover } from '../src/jobs/dailyRollover'
import { randomUUID } from 'crypto'

async function verify() {
    console.log('Starting verification...')
    const testUserId = randomUUID()
    const testEmail = `test-rollover-${testUserId}@example.com`

    try {
        // 1. Create Test User (UTC)
        await prisma.user.create({
            data: {
                id: testUserId,
                email: testEmail,
                passwordHash: 'dummy',
                timeZone: 'UTC',
                name: 'Rollover Test User'
            }
        })
        console.log('Created test user:', testUserId)

        // 2. Create Tasks
        // Task A: Deadline TODAY
        const taskTodayId = randomUUID()
        await prisma.task.create({
            data: {
                id: taskTodayId,
                userId: testUserId,
                title: 'Task Due Today',
                deadline: 'TODAY',
                status: 'PENDING'
            }
        })

        // Task B: Deadline TOMORROW
        const taskTomorrowId = randomUUID()
        await prisma.task.create({
            data: {
                id: taskTomorrowId,
                userId: testUserId,
                title: 'Task Due Tomorrow',
                deadline: 'TOMORROW',
                status: 'PENDING'
            }
        })
        console.log('Created test tasks')

        // 3. Run Rollover with simulated UTC Midnight
        const simulatedNow = new Date('2024-01-01T00:00:00Z')
        // This date is 00:00 UTC, so it should trigger the rollover for UTC users.

        console.log('Running rollover with simulated time:', simulatedNow.toISOString())
        await runDailyRollover(simulatedNow)

        // 4. Verify Results
        const taskToday = await prisma.task.findUnique({ where: { id: taskTodayId } })
        const taskTomorrow = await prisma.task.findUnique({ where: { id: taskTomorrowId } })

        let passed = true

        if (taskToday?.deadline !== 'SOMEDAY') {
            console.error('FAIL: TaskToday should be SOMEDAY, got:', taskToday?.deadline)
            passed = false
        } else {
            console.log('PASS: TaskToday moved to SOMEDAY')
        }

        if (taskTomorrow?.deadline !== 'TODAY') {
            console.error('FAIL: TaskTomorrow should be TODAY, got:', taskTomorrow?.deadline)
            passed = false
        } else {
            console.log('PASS: TaskTomorrow moved to TODAY')
        }

        if (passed) {
            console.log('SUCCESS: Verification Passed')
        } else {
            console.error('FAILURE: Verification Failed')
        }

    } catch (error) {
        console.error('Error during verification:', error)
    } finally {
        // Cleanup
        await prisma.task.deleteMany({ where: { userId: testUserId } })
        await prisma.user.delete({ where: { id: testUserId } })
        console.log('Cleanup complete')
        await prisma.$disconnect()
    }
}

verify()
