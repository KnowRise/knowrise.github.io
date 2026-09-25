import { notFound } from 'next/navigation';
import { getSettings, isMenuVisible } from './settings';
import type { MenuKey } from '../types';

export async function guardMenu(key: MenuKey): Promise<void> {
  const settings = await getSettings();
  if (!isMenuVisible(settings, key)) notFound();
}