export type MenuGroup = { title: string; items: string[] };
export type MenuItem = { label: string; groups: MenuGroup[] };

export const menu: MenuItem[] = [
  {
    label: "생명사역",
    groups: [
      { title: "교회소개", items: ["생명사역", "비전", "로고 CI", "교회연혁", "섬기는분들"] },
      { title: "담임목사", items: ["인사말", "소개", "칼럼"] },
      { title: "새가족안내", items: ["새가족안내", "새가족양육", "새가족등록신청", "새가족포토"] },
      { title: "더보기", items: ["생명사역훈련원", "생명사역 스토리"] },
    ],
  },
  {
    label: "예배",
    groups: [
      { title: "예배", items: ["church19 TV", "Bible", "경배와 찬양"] },
      { title: "안내", items: ["예배안내", "주차안내", "교회차량안내", "시설안내"] },
    ],
  },
  {
    label: "교육·훈련",
    groups: [
      { title: "교회학교", items: ["교회학교 소개", "영아부", "유치부", "유년부", "초등부", "소년부", "청소년부", "영어예배"] },
      { title: "청년·위원회", items: ["청년부", "영어예배위원회"] },
      { title: "장년교육훈련", items: ["훈련커리큘럼", "제자양육원", "제자사역훈련", "성경대학", "리딩바이블"] },
    ],
  },
  {
    label: "선교",
    groups: [
      { title: "선교", items: ["church19 세계선교회", "선교영상", "영어예배부", "중국어예배부", "베트남어예배부", "러시아어예배부"] },
    ],
  },
  {
    label: "온라인신청",
    groups: [
      { title: "교육 신청", items: ["성경대학신청", "훈련", "교회학교 신청", "세미나신청", "문화대학강좌신청"] },
      { title: "행정", items: ["기부금증명서", "온라인헌금안내", "교회탐방신청", "온라인행정"] },
    ],
  },
  {
    label: "교구",
    groups: [
      { title: "교구안내", items: ["교구소개", "교구편성(지역)", "사랑방 안내", "교구연간행사"] },
      { title: "순장교육", items: ["순장공지사항", "교육영상/교재", "공유자료실"] },
    ],
  },
  {
    label: "봉사/사역",
    groups: [
      { title: "문화대학", items: ["소개", "과목별소개", "사진/동영상", "수강신청"] },
      { title: "실버대학", items: ["소개", "과목별소개", "공지사항"] },
      { title: "위원회", items: ["위원회게시판"] },
    ],
  },
  {
    label: "나눔터",
    groups: [
      { title: "E-Book", items: ["주보", "교회소식지", "브로슈어"] },
      { title: "소식", items: ["공지사항", "생명사역 스토리", "경조사"] },
      { title: "갤러리", items: ["행사사진", "아기축복기도", "열린포토"] },
    ],
  },
];

export const quickLinks = [
  { label: "유튜브", icon: "play" },
  { label: "온라인헌금", icon: "heart" },
  { label: "성경프로그램", icon: "book" },
  { label: "온라인신청", icon: "edit" },
  { label: "주보", icon: "file" },
  { label: "공지사항", icon: "bell" },
] as const;

export const sermons = [
  { title: "합리주의의 함정", passage: "고린도전서 1:18-25", preacher: "담임목사", date: "2026-11-22", tag: "주일예배" },
  { title: "은혜로 걷는 제자도", passage: "누가복음 9:23-27", preacher: "담임목사", date: "2026-11-18", tag: "수요예배" },
  { title: "마지막 약속", passage: "요한복음 14:1-6", preacher: "담임목사", date: "2026-11-20", tag: "금요기도회" },
  { title: "함께 꿈꾸는 하나님 나라", passage: "마태복음 5:17-20", preacher: "담임목사", date: "2026-10-23", tag: "특별집회" },
];

export const stories = [
  { title: "감사의 눈으로 바라보는 삶", sub: "2026 추수감사주일", excerpt: "한 해 동안 베푸신 은혜를 돌아보며 온 성도가 함께 감사의 예배를 드렸습니다.", date: "2026-11-15", hue: "from-amber-400 to-orange-600" },
  { title: "몸과 마음으로 하나 되는 기쁨", sub: "2026 순장 소풍", excerpt: "가을 햇살 아래 순장들이 함께 걷고 교제하며 섬김의 기쁨을 나누었습니다.", date: "2026-11-14", hue: "from-emerald-400 to-teal-700" },
  { title: "사명을 나누는 만남", sub: "기독교 상담 세미나", excerpt: "상담과 돌봄의 사역을 함께 고민하고 비전을 나누는 귀한 시간이었습니다.", date: "2026-10-31", hue: "from-sky-400 to-indigo-700" },
];

export const notices = [
  { title: "2026 성탄절 연합예배 안내", date: "2026-11-24" },
  { title: "굿윌스토어 나눔 행사 안내", date: "2026-10-16" },
  { title: "사랑의 음악회", date: "2026-10-16" },
  { title: "제2회 마을페스티벌 부스 배치도 및 당일 안내", date: "2026-10-14" },
  { title: "2027년 교회학교 교사 모집", date: "2026-10-02" },
];

export const videoNews = ["2026-11-22", "2026-11-15", "2026-11-08", "2026-11-01"];

export const press = {
  headline: { title: "2027년 선교대회 주제 발표", excerpt: "다음 세대 선교를 위한 연합 대회의 주제와 일정이 발표되었습니다. 교회들이 함께 기도하며 준비하기로 했습니다.", date: "2026-11-17" },
  list: [
    { title: "‘선교적 성경해석학 컨퍼런스’ 개최", date: "2026-11-04" },
    { title: "[칼럼] 멀티태스킹의 함정", date: "2026-10-22" },
    { title: "이주민 1세대 넘어 자녀 세대로", date: "2026-08-24" },
  ],
};

export const subLinks = ["중직선거안내", "기부금영수증", "온라인헌금", "온라인행정", "주보"];

export const intro = [
  { label: "교회소개", desc: "church19의 비전과 역사", icon: "church" },
  { label: "새가족안내", desc: "처음 오신 분들을 환영합니다", icon: "users" },
  { label: "예배안내", desc: "예배 시간과 장소 안내", icon: "clock" },
  { label: "생명사역 훈련원", desc: "사람을 살리고, 키우고, 고치는 공동체", icon: "seed" },
] as const;

export const education = [
  { label: "교회학교", en: "Church School", hue: "from-yellow-300 to-amber-500" },
  { label: "청년부", en: "Young Adults", hue: "from-rose-300 to-pink-600" },
  { label: "영어예배위원회", en: "English Ministry", hue: "from-cyan-300 to-sky-600" },
  { label: "교육훈련", en: "Discipleship", hue: "from-lime-300 to-green-600" },
];

export const languages = [
  { label: "중국어예배부", en: "Chinese Worship", time: "주일 오후 1:30" },
  { label: "베트남어예배부", en: "Vietnamese Worship", time: "주일 오후 2:00" },
  { label: "러시아어예배부", en: "Russian Worship", time: "주일 오후 2:30" },
];

export const worshipTimes = [
  { name: "주일 1부", time: "오전 7:00" },
  { name: "주일 2부", time: "오전 9:00" },
  { name: "주일 3부", time: "오전 11:00" },
  { name: "주일 4부", time: "오후 1:30" },
  { name: "수요예배", time: "오후 7:30" },
  { name: "금요기도회", time: "오후 8:30" },
];
