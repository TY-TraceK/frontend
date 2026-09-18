export const RANKING_LIMIT = 10;

export const RANKING_TYPE = Object.freeze({
  REGION: {
    value: 'REGION',
    label: '지역',
  },
  LOCATION: {
    value: 'LOCATION',
    label: '여행지',
  },
});

export const LOCATION_CATEGORY = Object.freeze({
  ALL: {
    value: null,
    label: '전체',
  },

  ATTRACTION: {
    value: 'ATTRACTION',
    label: '관광지/명소',
  },

  CULTURE: {
    value: 'CULTURE',
    label: '문화시설/박물관/미술관',
  },

  FESTIVAL: {
    value: 'FESTIVAL',
    label: '축제/행사',
  },

  FILMING_LOCATION: {
    value: 'FILMING_LOCATION',
    label: '촬영지',
  },

  RESTAURANT: {
    value: 'RESTAURANT',
    label: '음식점/맛집',
  },

  CAFE: {
    value: 'CAFE',
    label: '카페',
  },

  ACCOMMODATION: {
    value: 'ACCOMMODATION',
    label: '숙박',
  },

  SHOPPING: {
    value: 'SHOPPING',
    label: '쇼핑',
  },

  ETC: {
    value: 'ETC',
    label: '기타',
  },
});

export const CONTENT_CATEGORY = Object.freeze({
  KPOP: {
    value: 'KPOP',
    label: 'K-POP',
  },

  DRAMA: {
    value: 'DRAMA',
    label: '드라마',
  },

  MOVIE: {
    value: 'MOVIE',
    label: '영화',
  },

  ENTERTAINMENT: {
    value: 'ENTERTAINMENT',
    label: '예능',
  },

  WEBTOON: {
    value: 'WEBTOON',
    label: '웹툰/애니메이션',
  },

  ETC: {
    value: 'ETC',
    label: '기타',
  },
});

export const RANKING_TYPE_OPTIONS = Object.values(RANKING_TYPE);
export const LOCATION_CATEGORY_OPTIONS = Object.values(LOCATION_CATEGORY);
export const CONTENT_CATEGORY_OPTIONS = Object.values(CONTENT_CATEGORY);
