import { prisma } from '../lib/prisma'
import { logger } from '../lib/logger'
import { toZonedTime } from 'date-fns-tz'

export async function runDailyRollover(testDate?: Date) {
  logger.info('Running daily task rollover job')

  try {
    // 1. Get all distinct timezones from users
    const users = await prisma.user.findMany({
      select: {
        timeZone: true,
      },
      distinct: ['timeZone'],
    })

    const timezones = users.map((u: { timeZone: string }) => u.timeZone)
    const processedTimezones = []

    for (const timezone of timezones) {
      // 2. Check if it's midnight (00:00) in this timezone
      // We check for the hour 0. Since this runs hourly, it should catch the midnight hour.
      const now = testDate || new Date()
      // @ts-ignore - date-fns-tz v3 type definition issue
      const zonedTime = toZonedTime(now, timezone)
      const currentHour = zonedTime.getHours()

      if (currentHour === 0) {
        processedTimezones.push(timezone)

        logger.info(`Processing rollover for timezone: ${timezone}`)

        // 3. Find users in this timezone
        const usersInTimezone = await prisma.user.findMany({
          where: { timeZone: timezone },
          select: { id: true },
        })

        const userIds = usersInTimezone.map((u: { id: string }) => u.id)

        if (userIds.length === 0) continue

        // 4. Perform Rollover Logic

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx: any) => {
          // 1. "Clear Today" -> "Someday"
          // Move incomplete tasks with deadline: TODAY to deadline: SOMEDAY
          const demoted = await tx.task.updateMany({
            where: {
              userId: { in: userIds },
              deadline: 'TODAY',
              status: 'PENDING',
              deletedAt: null,
            },
            data: {
              deadline: 'SOMEDAY',
            },
          })

          if (demoted.count > 0) {
            logger.info(`Moved ${demoted.count} incomplete tasks from TODAY to SOMEDAY for timezone ${timezone}`)
          }

          // 2. "Promote Tomorrow" -> "Today"
          // Move tasks with deadline: TOMORROW to deadline: TODAY
          const promoted = await tx.task.updateMany({
            where: {
              userId: { in: userIds },
              deadline: 'TOMORROW',
              status: 'PENDING',
              deletedAt: null,
            },
            data: {
              deadline: 'TODAY',
            },
          })
          if (promoted.count > 0) {
            logger.info(`Promoted ${promoted.count} tasks from TOMORROW to TODAY for timezone ${timezone}`)
          }
        })
      }
    }

    logger.info(`Daily rollover computed. Processed timezones: ${processedTimezones.join(', ') || 'None'}`)
  } catch (error) {
    logger.error('Error in daily rollover job:', error)
  }
}
