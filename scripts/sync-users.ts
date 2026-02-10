import { supabase } from './../src/plugins/supabase';
import { prisma } from './../src/plugins/prisma';


async function syncUsers() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Ошибка получения пользователей:", error);
      return;
    }

    for (const authUser of users) {
      const existingUser = await prisma.user.findUnique({
        where: { supabaseId: authUser.id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            supabaseId: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || null,
            avatar: authUser.user_metadata?.avatar || null,
            agreed: false,
          },
        });
        console.log(`✅ Создан пользователь: ${authUser.email}`);
      }
    }

    console.log("✅ Синхронизация завершена");
  } catch (error) {
    console.error("❌ Ошибка синхронизации:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncUsers();