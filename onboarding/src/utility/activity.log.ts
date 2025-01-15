// activityLog.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// const prisma = new PrismaClient();

export async function createActivityLog({
  user_id,
  ip_address,
  activity_type,
  device_type,
  device_info, 
}: {
    user_id: string
    ip_address: string
    activity_type: string
    device_type: string
    device_info: string
}) {
  try {
    const activityLog = await prisma.activity_logs.create({
      data: {
        user_id,
        ip_address,
        activity_type,
        device_type,
        device_info
      }
    });
    return activityLog;
  } catch (error) {
    console.error(error);
    throw error;
  }
}