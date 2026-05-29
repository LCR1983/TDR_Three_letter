import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tdlAreas = [
    { code: 'W/B', name: 'ワールドバザール', englishName: 'World Bazaar', sortOrder: 1 },
    { code: 'A/L', name: 'アドベンチャーランド', englishName: 'Adventureland', sortOrder: 2 },
    { code: 'W/L', name: 'ウエスタンランド', englishName: 'Westernland', sortOrder: 3 },
    { code: 'C/C', name: 'クリッターカントリー', englishName: 'Critter Country', sortOrder: 4 },
    { code: 'F/L', name: 'ファンタジーランド', englishName: 'Fantasyland', sortOrder: 5 },
    { code: 'T/T', name: 'トゥーンタウン', englishName: 'Toontown', sortOrder: 6 },
    { code: 'T/L', name: 'トゥモローランド', englishName: 'Tomorrowland', sortOrder: 7 },
  ]

  const tdsAreas = [
    { code: 'M/H', name: 'メディテレーニアンハーバー', englishName: 'Mediterranean Harbor', sortOrder: 1 },
    { code: 'A/W', name: 'アメリカンウォーターフロント', englishName: 'American Waterfront', sortOrder: 2 },
    { code: 'P/D', name: 'ポートディスカバリー', englishName: 'Port Discovery', sortOrder: 3 },
    { code: 'L/R', name: 'ロストリバーデルタ', englishName: 'Lost River Delta', sortOrder: 4 },
    { code: 'A/C', name: 'アラビアンコースト', englishName: 'Arabian Coast', sortOrder: 5 },
    { code: 'M/L', name: 'マーメイドラグーン', englishName: 'Mermaid Lagoon', sortOrder: 6 },
    { code: 'M/I', name: 'ミステリアスアイランド', englishName: 'Mysterious Island', sortOrder: 7 },
    { code: 'F/S', name: 'ファンタジースプリングス', englishName: 'Fantasy Springs', sortOrder: 8 },
  ]

  for (const area of tdlAreas) {
    await prisma.area.upsert({
      where: { park_code: { park: 'TDL', code: area.code } },
      update: {},
      create: { park: 'TDL', ...area },
    })
  }

  for (const area of tdsAreas) {
    await prisma.area.upsert({
      where: { park_code: { park: 'TDS', code: area.code } },
      update: {},
      create: { park: 'TDS', ...area },
    })
  }

  console.log('Seed completed: areas created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
