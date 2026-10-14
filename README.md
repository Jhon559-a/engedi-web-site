# ENGEDI ATELIER — 무료 상품 소개 사이트

이 폴더는 공개용으로 내보낸 상품 소개 사이트입니다.
`public/`와 `render.yaml`을 같은 GitHub 저장소 최상위에 올립니다.

Render 설정:
- 서비스: Static Site (Web Service가 아닙니다)
- Build Command: true
- Publish Directory: public
- Auto-Deploy: Off (검토 후 Manual Deploy > Deploy latest commit)
- 환경변수·데이터베이스·유료 디스크·AI API 키: 사용하지 않습니다.
- 자체 도메인 구입 없이 Render가 제공하는 onrender.com 주소로 시작합니다.

관리자는 기존 PC의 관리자 화면에서 상품을 수정한 다음 EXPORT_CATALOG.cmd를
실행합니다. 새 공개 폴더를 검토하고 저장소의 public/ 전체를 동기화한 뒤
수동 배포합니다. 삭제/숨김된 사진이 옛 공개 폴더에 남지 않게 제거 파일도
함께 반영해야 합니다. 원본 작업 폴더나 private 백업을 업로드하지 마세요.

상품 검색·관심상품·선택 목록·예시 코디가 제공됩니다. 관심상품과 선택 목록은
현재 브라우저에만 저장됩니다. 회원가입·주문·결제·신규 AI 생성은 제공하지 않습니다.
실제 등록 상품이 없으면 준비 중 화면이 표시되며 예시 컬렉션은 별도로 표시합니다.

공개 파일을 만드는 것만으로 인터넷에 게시되지는 않습니다.
Render 무료 한도는 https://render.com/docs/outbound-bandwidth 에서 확인합니다.
무료 운영 시 결제 수단을 등록하지 않으면 초과 사용 시 서비스가 제한될 수 있습니다.
