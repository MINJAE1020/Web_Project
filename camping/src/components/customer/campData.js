export const sampleCampsites = [
  {
    camp_id: 1,
    camp_type: '캠핑',
    facility: '샤워장, 화장실, 주차장',
    environment: '산 속, 자연 경관',
    start_manner: '22:00',
    over_manner: '07:00',
    camp_name: '태안 캠핑장',
    camp_address: '충청남도 태안',
    contact: '010-1234-5678',
    introduction: '태안의 아름다운 자연 속에서 편안한 휴식을 즐길 수 있는 캠핑장입니다.',
    check_in_time: '15:00',
    check_out_time: '11:00',
    reviews: [
      {
        review_id: 1,
        book_id: 'ABC123',
        comments: '정말 좋은 캠핑장이었어요!',
      },
      {
        review_id: 2,
        book_id: 'DEF456',
        comments: '시설이 깨끗하고 좋았어요.',
      },
    ],
    book_status: '예약', // 예약 상태 예시
  },
  {
    camp_id: 2,
    camp_type: '글램핑, 카라반',
    facility: '수영장, 바베큐장, 카페',
    environment: '산속, 강가',
    start_manner: '21:00',
    over_manner: '06:00',
    camp_name: '강릉 글램핑',
    camp_address: '강원도 강릉',
    contact: '010-2345-6789',
    introduction: '강릉의 아름다운 자연 속에서 편안한 글램핑을 즐길 수 있는 곳입니다.',
    check_in_time: '16:00',
    check_out_time: '10:00',
    book_status: '승인', // 승인 상태 예시
  },
  {
    camp_id: 3,
    camp_type: '카라반',
    facility: '야외 수영장, 레스토랑',
    environment: '산 중턱, 바다 근처',
    start_manner: '23:00',
    over_manner: '06:30',
    camp_name: '경주 카라반',
    camp_address: '경상북도 경주',
    contact: '010-3456-7890',
    introduction: '경주에서 멋진 자연 속에서 카라반 캠핑을 즐길 수 있는 곳입니다.',
    check_in_time: '14:00',
    check_out_time: '12:00',
    book_status: '거부', // 거부 상태 예시
  },
  // 추가 캠핑장 정보들을 위와 같은 형식으로 계속해서 추가할 수 있습니다.
];
