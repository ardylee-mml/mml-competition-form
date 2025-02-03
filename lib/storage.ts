import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data', 'applications.json');

export type Application = {
  id: string;
  name: string;
  email: string;
  discordId: string;
  teamName: string;
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
};

export async function saveApplication(data: Omit<Application, 'id' | 'createdAt'>) {
  try {
    let applications: Application[] = [];
    
    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf8');
      applications = JSON.parse(fileContent);
    } catch {
      // If file doesn't exist or is empty, start with empty array
      await fs.writeFile(dataFilePath, '[]');
    }

    if (!Array.isArray(applications)) {
      applications = [];
    }
    
    const newApplication = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    applications.push(newApplication);
    await fs.writeFile(dataFilePath, JSON.stringify(applications, null, 2));
    
    return newApplication;
  } catch (error) {
    console.error('Error saving application:', error);
    throw new Error('Failed to save application');
  }
}

export async function loadApplications(): Promise<Application[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const applications = JSON.parse(data);
    return Array.isArray(applications) ? applications : [];
  } catch (error) {
    return [];
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
    const applications = await loadApplications();
    
    const total = applications.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: applications.slice(start, end),
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

async function ensureFilePermissions() {
  try {
    // Check if file exists, create if not
    try {
      await fs.access(dataFilePath);
    } catch {
      await fs.writeFile(dataFilePath, JSON.stringify({ applications: [] }));
    }
    
    // Set proper file permissions (readable/writable only by the application)
    await fs.chmod(dataFilePath, 0o600);
  } catch (error) {
    console.error('Error setting file permissions:', error);
    throw new Error('Failed to set file permissions');
  }
}

export async function isEmailRegistered(email: string): Promise<boolean> {
  const applications = await loadApplications();
  return applications.some(app => app.email.toLowerCase() === email.toLowerCase());
}

export async function isDiscordIdRegistered(discordId: string): Promise<boolean> {
  const applications = await loadApplications();
  return applications.some(app => app.discordId.toLowerCase() === discordId.toLowerCase());
}

export async function deleteApplication(id: string): Promise<void> {
  try {
    const applications = await loadApplications();
    const filteredApplications = applications.filter(app => app.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(filteredApplications, null, 2));
  } catch (error) {
    console.error('Error deleting application:', error);
    throw new Error('Failed to delete application');
  }
} 