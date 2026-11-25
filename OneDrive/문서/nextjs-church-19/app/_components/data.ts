export type MenuGroup = { title: string; items: string[] };
export type MenuItem = { label: string; groups: MenuGroup[] };

export const BRAND = "rental house";
export const TAGLINE = "Stay & Rest";

export const menu: MenuItem[] = [
  {
    label: "소개",
    groups: [
      { title: "About", items: ["브랜드 스토리", "공간 철학", "오시는 길"] },
    ],
  },
  {
    label: "객실",
    groups: [
      { title: "Rooms", items: ["숲 FOREST", "빛 LIGHT", "쉼 REST"] },
      { title: "안내", items: ["객실 비교", "어메니티", "추가 인원 안내"] },
    ],
  },
  {
    label: "시설",
    groups: [
      { title: "Facilities", items: ["프라이빗 배스", "오픈 키친", "가든 테라스", "불멍 & 바비큐"] },
    ],
  },
  {
    label: "예약",
    groups: [
      { title: "Reservation", items: ["실시간 예약", "예약 확인", "이용 안내", "환불 규정"] },
    ],
  },
  {
    label: "주변 여행",
    groups: [
      { title: "Travel", items: ["산책 코스", "카페 & 맛집", "계절 액티비티"] },
    ],
  },
  {
    label: "고객센터",
    groups: [
      { title: "Support", items: ["공지사항", "자주 묻는 질문", "1:1 문의"] },
    ],
  },
];

export const quickLinks = [
  { label: "객실", icon: "bed" },
  { label: "예약", icon: "calendar" },
  { label: "오시는 길", icon: "pin" },
  { label: "공지사항", icon: "bell" },
  { label: "FAQ", icon: "file" },
  { label: "문의", icon: "phone" },
] as const;

export const rooms = [
  {
    no: "01",
    name: "숲",
    en: "FOREST",
    desc: "삼각 창 너머로 소나무 숲이 가득 들어오는 거실과 다락 침실. 아침이면 새소리에 눈을 뜹니다.",
    base: 2,
    max: 4,
    size: "66㎡",
    bed: "퀸 1 · 싱글 2",
    price: 280000,
  },
  {
    no: "02",
    name: "빛",
    en: "LIGHT",
    desc: "하얀 벽과 큰 창, 하루 종일 빛이 머무는 미니멀한 공간. 둘만의 조용한 휴식을 위한 객실입니다.",
    base: 2,
    max: 2,
    size: "42㎡",
    bed: "킹 1",
    price: 220000,
  },
  {
    no: "03",
    name: "쉼",
    en: "REST",
    desc: "창가 욕조와 낮은 침대, 따뜻한 원목 가구로 채운 공간. 아무것도 하지 않을 자유를 드립니다.",
    base: 2,
    max: 3,
    size: "50㎡",
    bed: "킹 1 · 데이베드 1",
    price: 250000,
  },
];

export const facilities = [
  { name: "프라이빗 배스", en: "Private Bath", desc: "창가 욕조에서 즐기는 반신욕" },
  { name: "오픈 키친", en: "Open Kitchen", desc: "간단한 조리가 가능한 키친" },
  { name: "가든 테라스", en: "Garden Terrace", desc: "초록 속에서 즐기는 아침 커피" },
  { name: "어메니티", en: "Amenity", desc: "엄선한 타월과 바스 제품" },
];

export const stayInfo = [
  { name: "체크인", value: "15:00" },
  { name: "체크아웃", value: "11:00" },
  { name: "바비큐 이용", value: "17:00 – 21:00" },
  { name: "매너 타임", value: "22:00 이후" },
  { name: "반려동물", value: "동반 불가" },
  { name: "주차", value: "객실당 1대 무료" },
];

export const heroCopy = [
  { eyebrow: "Stay", title: "머무는 시간이 여행이 되는 곳", en: "Where your stay becomes the journey" },
  { eyebrow: "Forest", title: "숲의 소리로 아침을 엽니다", en: "Wake up to the sound of the forest" },
  { eyebrow: "Light", title: "빛이 머무는 거실에서", en: "In a living room where light lingers" },
  { eyebrow: "Night", title: "고요한 밤, 오롯이 우리만", en: "A quiet night, just for us" },
];

export const business = [
  "상호명 rental house",
  "대표 ○○○",
  "문의 000 0000 0000",
  "사업자번호 000 00 00000",
  "○○도 ○○군 ○○면 숲속길 19",
  "통신판매업신고 0000-○○○○-0000",
];

export const won =(n: number) => n.toLocaleString("ko-KR");
