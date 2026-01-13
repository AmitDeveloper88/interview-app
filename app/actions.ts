'use server';

import { TopicData } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function saveTopicData(slug: string, data: TopicData) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', `${slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    
    // Revalidate the specific topic page and the home page
    revalidatePath(`/t/${slug}`);
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to save data for ${slug}:`, error);
    return { success: false, error: 'Failed to save data' };
  }
}
