export function prismaKoaPrismaTs() {
  return `
    import { PrismaClient } from '@prisma/client';
    
    export const prisma = new PrismaClient();
          `;
}
