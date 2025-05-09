// activityLog.ts
import { PrismaClient } from '@prisma/client';
import axios from 'axios'
const prisma = new PrismaClient();

// const prisma = new PrismaClient();

export async function createActivityLog({
  user_id,
  ip_address,
  activity_type,
  device_type,
  device_info, 
  location
}: {
    user_id: string
    ip_address: string
    activity_type: string
    device_type: string
    device_info: string
    location: string
}) {
  try {
    const activityLog = await prisma.activity_logs.create({
      data: {
        user_id,
        ip_address,
        activity_type,
        device_type,
        device_info,
        location
      }
    });
    return activityLog;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getIplocation(ip: string) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = response.data;
    if (data.status === 'success') {
      return `${data.city}, ${data.regionName}, ${data.country}`;
    } else {
      return 'Unknown';
    }
  } catch (err:any) {
    console.error('Failed to fetch location from IP:', err.message);
    return "Unknown";
  }
}
