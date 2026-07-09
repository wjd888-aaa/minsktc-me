export const MINSK_METRO = [
  { id: 'uruche', order: 1, name: 'Уручча / 乌鲁奇耶', line: 'moskovskaya' },
  { id: 'borisov', order: 2, name: 'Барысаўскі тракт / 鲍里索夫大道', line: 'moskovskaya' },
  { id: 'vostok', order: 3, name: 'Усход / 东方站', line: 'moskovskaya' },
  { id: 'moskovskaya', order: 4, name: 'Маскоўская / 莫斯科站', line: 'moskovskaya' },
  { id: 'park', order: 5, name: 'Парк Чалюскінцаў / 切柳斯金公园', line: 'moskovskaya' },
  { id: 'academy', order: 6, name: 'Акадэмія навук / 科学院', line: 'moskovskaya' },
  { id: 'kolasa', order: 7, name: 'Плошча Якуба Коласа / 雅库布·科拉斯广场', line: 'moskovskaya' },
  { id: 'pobedy', order: 8, name: 'Плошча Перамогі / 胜利广场', line: 'moskovskaya' },
  { id: 'oktyabrskaya', order: 9, name: 'Кастрычніцкая / 十月站', line: 'moskovskaya' },
  { id: 'lenina', order: 10, name: 'Плошча Леніна / 列宁广场', line: 'moskovskaya' },
  { id: 'kultury', order: 11, name: 'Інстытут Культуры / 文化学院', line: 'moskovskaya' },
  { id: 'grushevka', order: 12, name: 'Грушаўка / 格鲁舍夫卡', line: 'moskovskaya' },
  { id: 'mihalovo', order: 13, name: 'Міхалова / 米哈洛沃', line: 'moskovskaya' },
  { id: 'petrovshina', order: 14, name: 'Пятроўшчына / 彼得罗夫希纳', line: 'moskovskaya' },
  { id: 'malinovka', order: 15, name: 'Малінаўка / 马利诺夫卡', line: 'moskovskaya' },

  { id: 'kamennaya', order: 16, name: 'Каменная Горка / 石山', line: 'avtozavodskaya' },
  { id: 'kuncovshina', order: 17, name: 'Кунцаўшчына / 昆采夫希纳', line: 'avtozavodskaya' },
  { id: 'sportivnaya', order: 18, name: 'Спартыўная / 体育站', line: 'avtozavodskaya' },
  { id: 'pushkinskaya', order: 19, name: 'Пушкінская / 普希金站', line: 'avtozavodskaya' },
  { id: 'molodezhnaya', order: 20, name: 'Маладзёжная / 青年站', line: 'avtozavodskaya' },
  { id: 'frunzenskaya', order: 21, name: 'Фрунзенская / 伏龙芝站', line: 'avtozavodskaya' },
  { id: 'nemiga', order: 22, name: 'Няміга / 涅米加', line: 'avtozavodskaya' },
  { id: 'kupalovskaya', order: 23, name: 'Купалаўская / 库帕洛夫站', line: 'avtozavodskaya' },
  { id: 'pervomayskaya', order: 24, name: 'Першамайская / 五一站', line: 'avtozavodskaya' },
  { id: 'proletarskaya', order: 25, name: 'Пралетарская / 无产阶级站', line: 'avtozavodskaya' },
  { id: 'traktorny', order: 26, name: 'Трактарны Завод / 拖拉机厂', line: 'avtozavodskaya' },
  { id: 'partizanskaya', order: 27, name: 'Партызанская / 游击站', line: 'avtozavodskaya' },
  { id: 'avtozavodskaya', order: 28, name: 'Аўтазаводская / 汽车厂站', line: 'avtozavodskaya' },
  { id: 'mogilevskaya', order: 29, name: 'Магілёўская / 莫吉廖夫站', line: 'avtozavodskaya' },

  { id: 'yubileynaya', order: 30, name: 'Юбілейная плошча /  jubilee square', line: 'zelenaluzhskaya' },
  { id: 'bogushevicha', order: 31, name: 'Плошча Францішка Багушэвіча / 博古舍维奇广场', line: 'zelenaluzhskaya' },
  { id: 'vokzalnaya', order: 32, name: 'Вакзальная / 火车站', line: 'zelenaluzhskaya' },
  { id: 'kovalskaya', order: 33, name: 'Ковальская Слабада / 铁匠镇', line: 'zelenaluzhskaya' },
  { id: 'aerodromnaya', order: 34, name: 'Аэрадромная / 机场站', line: 'zelenaluzhskaya' },
  { id: 'nemorshansky', order: 35, name: 'Немаршанскі Сад / 涅莫尔尚花园', line: 'zelenaluzhskaya' },
]

export const METRO_LINES = {
  moskovskaya: { name: 'Маскоўская лінія / 莫斯科线 (蓝)', color: '#1e90ff' },
  avtozavodskaya: { name: 'Аўтазаводская лінія / 汽车厂线 (红)', color: '#dc143c' },
  zelenaluzhskaya: { name: 'Зеленалужская лінія / 绿草地线 (绿)', color: '#32cd32' }
}

export function displayMetro(station) {
  return `${station.order}. ${station.name}`
}

export function getMetroName(id) {
  const s = MINSK_METRO.find(s => s.id === id)
  return s ? displayMetro(s) : id
}
