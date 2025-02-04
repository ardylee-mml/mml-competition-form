import { Redis } from '@upstash/redis'
import { v4 as uuidv4 } from 'uuid'

// Use the KV environment variables
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string;
  createdAt: string;
  discordId?: string;
}

export async function saveApplication(data: Omit<Application, 'id' | 'createdAt'>) {
  try {
    const newApplication = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    // Save to Redis
    await redis.hset('applications', {
      [newApplication.id]: JSON.stringify(newApplication)
    });
    
    return newApplication;
  } catch (error) {
    console.error('Storage error:', error);
    throw new Error('Failed to save application');
  }
}

interface PaginatedResult {
  data: Application[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getApplications(page = 1, pageSize = 10): Promise<PaginatedResult> {
  try {
    const applications = await redis.hgetall('applications');
    const values = Object.values(applications || {})
      .map(str => JSON.parse(str as string))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const total = values.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: values.slice(start, end),
      total,
      page,
      pageSize,
      totalPages
    };
  } catch (error) {
    console.error('Error reading applications:', error);
    throw new Error('Failed to read applications');
  }
}

export async function loadApplications(): Promise<Application[]> {
  try {
    const applications = await redis.hgetall('applications');
    const values = Object.values(applications || {})
      .map(str => JSON.parse(str as string));
    return values;
  } catch (error) {
    return [];
  }
}

async function ensureFilePermissions() {
  try {
    // Check if file exists, create if not
    try {
      await redis.hgetall('applications');
    } catch {
      await redis.hset('applications', {});
    }
    
    // Set proper file permissions (readable/writable only by the application)
    // This is not applicable for Redis
  } catch (error) {
    console.error('Error setting file permissions:', error);
    throw new Error('Failed to set file permissions');
  }
}

export async function isEmailRegistered(email: string): Promise<boolean> {
  const applications = await redis.hgetall('applications');
  const values = Object.values(applications || {})
    .map(str => JSON.parse(str as string) as Application);
  return values.some(app => app.email.toLowerCase() === email.toLowerCase());
}

export async function isDiscordIdRegistered(discordId: string): Promise<boolean> {
  const applications = await redis.hgetall('applications');
  const values = Object.values(applications || {})
    .map(str => JSON.parse(str as string) as Application);
  return values.some(app => app.discordId?.toLowerCase() === discordId.toLowerCase());
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    await redis.hdel('applications', id);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
} 