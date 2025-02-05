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
  teamName: string;
  discordId: string;
  teamMembers: string;
  teamExperience: string;
  previousProjects: string;
  teamExperienceDescription: string;
  gameGenre: string;
  gameTitle: string;
  gameConcept: string;
  whyWin: string;
  whyPlayersLike: string;
  promotionPlan: string;
  monetizationPlan: string;
  projectedDAU: number;
  dayOneRetention: number;
  developmentTimeline: string;
  resourcesTools: string;
  acknowledgment: boolean;
  createdAt: string;
  // ... other fields
}

export async function saveApplication(data: Omit<Application, 'id' | 'createdAt'>) {
  try {
    const newApplication = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    const key = `application:${newApplication.id}`;
    await redis.set(key, JSON.stringify(newApplication));
    
    return newApplication;
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}

interface PaginatedResult {
  data: Application[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getApplications() {
  try {
    const keys = await redis.keys('application:*');
    const applications = await Promise.all(
      keys.map(async (key) => {
        try {
          const data = await redis.get(key);
          return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (err) {
          console.error('Error parsing application data for key:', key, err);
          return null;
        }
      })
    );
    
    return applications.filter(Boolean);
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

export async function isDiscordIdRegistered(discordId: string): Promise<boolean> {
  try {
    const keys = await redis.keys('application:*');
    const applications = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return typeof data === 'string' ? JSON.parse(data) : data;
      })
    );
    
    return applications.some(app => 
      app?.discordId?.toLowerCase() === discordId.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking Discord ID:', error);
    return false;
  }
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const key = `application:${id}`;
    await redis.del(key);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
}

export async function isEmailRegistered(email: string): Promise<boolean> {
  try {
    const keys = await redis.keys('application:*');
    const applications = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return typeof data === 'string' ? JSON.parse(data) : data;
      })
    );
    
    return applications.some(app => 
      app?.email?.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
} 