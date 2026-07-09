export const MINSK_METRO = [
  { id: 'malinovka', code: 110, name: 'МАЛИНОВКА / 马利诺夫卡', line: 'moskovskaya' },
  { id: 'petrovshina', code: 111, name: 'ПЕТРОВЩИНА / 彼得罗夫希纳', line: 'moskovskaya' },
  { id: 'mihalovo', code: 112, name: 'МИХАЛОВО / 米哈洛沃', line: 'moskovskaya' },
  { id: 'grushevka', code: 113, name: 'ГРУШЕВКА / 格鲁舍夫卡', line: 'moskovskaya' },
  { id: 'kultury', code: 114, name: 'ИНСТИТУТ КУЛЬТУРЫ / 文化学院', line: 'moskovskaya' },
  { id: 'lenina', code: 115, name: 'ПЛОЩАДЬ ЛЕНИНА / 列宁广场', line: 'moskovskaya' },
  { id: 'oktyabrskaya', code: 116, name: 'ОКТЯБРЬСКАЯ / 十月站', line: 'moskovskaya' },
  { id: 'pobedy', code: 117, name: 'ПЛОЩАДЬ ПОБЕДЫ / 胜利广场', line: 'moskovskaya' },
  { id: 'kolasa', code: 118, name: 'ПЛОЩАДЬ ЯКУБА КОЛАСА / 雅库布·科拉斯广场', line: 'moskovskaya' },
  { id: 'academy', code: 119, name: 'АКАДЕМИЯ НАУК / 科学院', line: 'moskovskaya' },
  { id: 'park', code: 120, name: 'ПАРК ЧЕЛЮСКИНЦЕВ / 切柳斯金采夫公园', line: 'moskovskaya' },
  { id: 'moskovskaya', code: 121, name: 'МОСКОВСКАЯ / 莫斯科站', line: 'moskovskaya' },
  { id: 'vostok', code: 122, name: 'ВОСТОК / 东方站', line: 'moskovskaya' },
  { id: 'borisov', code: 123, name: 'БОРИСОВСКИЙ ТРАКТ / 鲍里索夫大道', line: 'moskovskaya' },
  { id: 'uruche', code: 124, name: 'УРУЧЬЕ / 乌鲁奇耶', line: 'moskovskaya' },

  { id: 'mogilevskaya', code: 210, name: 'МОГИЛЕВСКАЯ / 莫吉廖夫站', line: 'avtozavodskaya' },
  { id: 'avtozavodskaya', code: 211, name: 'АВТОЗАВОДСКАЯ / 汽车厂站', line: 'avtozavodskaya' },
  { id: 'partizanskaya', code: 212, name: 'ПАРТИЗАНСКАЯ / 游击站', line: 'avtozavodskaya' },
  { id: 'traktorny', code: 213, name: 'ТРАКТОРНЫЙ ЗАВОД / 拖拉机厂站', line: 'avtozavodskaya' },
  { id: 'proletarskaya', code: 214, name: 'ПРОЛЕТАРСКАЯ / 无产阶级站', line: 'avtozavodskaya' },
  { id: 'pervomayskaya', code: 215, name: 'ПЕРВОМАЙСКАЯ / 五一站', line: 'avtozavodskaya' },
  { id: 'kupalovskaya', code: 216, name: 'КУПАЛОВСКАЯ / 库帕洛夫斯基站', line: 'avtozavodskaya' },
  { id: 'nemiga', code: 217, name: 'НЕМИГА / 涅米加站', line: 'avtozavodskaya' },
  { id: 'frunzenskaya', code: 218, name: 'ФРУНЗЕНСКАЯ / 伏龙芝站', line: 'avtozavodskaya' },
  { id: 'molodezhnaya', code: 219, name: 'МОЛОДЁЖНАЯ / 青年站', line: 'avtozavodskaya' },
  { id: 'pushkinskaya', code: 220, name: 'ПУШКИНСКАЯ / 普希金站', line: 'avtozavodskaya' },
  { id: 'sportivnaya', code: 221, name: 'СПОРТИВНАЯ / 体育站', line: 'avtozavodskaya' },
  { id: 'kuncovshina', code: 222, name: 'КУНЦЕВЩИНА / 昆采夫希纳', line: 'avtozavodskaya' },
  { id: 'kamennaya', code: 223, name: 'КАМЕННАЯ ГОРКА / 石头城', line: 'avtozavodskaya' },

  { id: 'kovalskaya', code: 310, name: 'КОВАЛЬСКАЯ СЛОБОДА / 科瓦利斯卡亚·斯洛博达', line: 'zelenaluzhskaya' },
  { id: 'vokzalnaya', code: 311, name: 'ВОКЗАЛЬНАЯ / 火车站', line: 'zelenaluzhskaya' },
  { id: 'bogushevicha', code: 312, name: 'ПЛОЩАДЬ ФРАНТИШКА БОГУШЕВИЧА / 弗朗齐什克·博古舍维奇广场', line: 'zelenaluzhskaya' },
  { id: 'yubileynaya', code: 313, name: 'ЮБИЛЕЙНАЯ / jubilee站', line: 'zelenaluzhskaya' },
]

export const METRO_LINES = {
  moskovskaya: { name: 'Маскоўская лінія / 莫斯科线 (蓝)', color: '#1e90ff' },
  avtozavodskaya: { name: 'Аўтазаводская лінія / 汽车厂线 (红)', color: '#dc143c' },
  zelenaluzhskaya: { name: 'Зеленалужская лінія / 绿草地线 (绿)', color: '#32cd32' }
}

export function displayMetro(station) {
  return `${station.code} ${station.name}`
}

export function getMetroName(id) {
  const s = MINSK_METRO.find(s => s.id === id)
  return s ? displayMetro(s) : id
}
