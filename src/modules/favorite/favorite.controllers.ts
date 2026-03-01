import prisma from "../../plugins/prisma";

async function toggleFavorite(userId: number, popularId: number) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_popularId: {
        userId,
        popularId,
      },
    },
  });
  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return { favorited: false };
  }
  await prisma.favorite.create({
    data: {
      userId,
      popularId,
    },
  });

  return { favorited: true };
}

export default { toggleFavorite };
