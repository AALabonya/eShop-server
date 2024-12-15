
import { UserRole } from '@prisma/client';
import prisma from './prisma';
import config from '../config';
import bcrypt from 'bcryptjs';

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findUnique({
      where: {
        role: UserRole.SUPER_ADMIN,
        email: config.admin_email,
      },
    });

    if (!isSuperAdminExists) {
      if (!config.admin_password || !config.bcrypt_salt_rounds) {
        throw new Error('Admin password or bcrypt salt rounds are not defined in the config');
      }

      const hashedPassword = await bcrypt.hash(
        config.admin_password as string,
        Number(config.bcrypt_salt_rounds),
      );

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: config.admin_email as string,
            password: hashedPassword,
            role: UserRole.SUPER_ADMIN,
          },
        });

        await tx.admin.create({
          data: {
            name: 'Super Admin',
            email: user.email,
            image: config.admin_photo,
          },
        });
      });

      console.log('Super Admin created successfully...');
      console.log('Seeding completed...');
    }
  } catch (err) {
    console.log('Error in seeding', err);
  } finally {
    await prisma.$disconnect();
  }
};