# 🌸 MY AI OFFICE: 따라하기 가이드

픽셀 사무실에 AI 에이전트들을 앉혀 두고 웹에 올리는 프로젝트예요.
STEP 1~3만 하면 **0원으로 내 사무실 주소**가 생겨요. STEP 4~6은 원할 때 하면 돼요.

```
my-ai-office/
├── index.html     ← 사무실 화면 (에이전트 설정도 여기 위쪽에 있어요)
├── api/chat.js    ← AI 연결용 (키가 없으면 데모 답변으로 동작)
└── README.md      ← 이 가이드
```

---

## STEP 1. 내 컴퓨터에서 미리보기 (1분)
1. 받은 `my-ai-office.zip`의 압축을 풀어요.
2. `index.html`을 더블클릭하면 브라우저에서 사무실이 열려요.
3. 방향키나 WASD로 걸어 다니고, 에이전트 옆에서 채팅해 보세요.
   - 지금은 AI 연결 전이라 **(데모 답변)**이 떠요. 정상이에요.

## STEP 2. GitHub에 올리기 (5분)
1. https://github.com 에 가입하고 로그인해요.
2. 오른쪽 위 **+** 를 누르고 **New repository**를 골라요.
   - Repository name: `my-ai-office`
   - **Public / Private** 둘 다 괜찮아요.
   - **Create repository**를 눌러요.
3. 다음 화면에서 **uploading an existing file** 링크를 눌러요.
4. 압축 푼 폴더 **안의 내용물**(`index.html`, `api` 폴더, `README.md`)을 통째로 끌어다 놓아요.
   - ⚠️ `my-ai-office` 폴더 자체가 아니라 그 **안의 파일들**을 올려야 해요.
   - `api` 폴더가 빠지지 않았는지 확인하세요.
5. 아래 **Commit changes**를 눌러요.

## STEP 3. Vercel로 배포하기 (3분) → 내 주소 생성!
1. https://vercel.com 에서 **Sign Up**을 누르고 **Continue with GitHub**로 가입해요. 플랜은 **Hobby(무료)**를 골라요.
2. **Add New… → Project**를 눌러요.
3. 목록에서 `my-ai-office` 옆의 **Import**를 눌러요. (안 보이면 GitHub 권한 설정에서 저장소 접근을 허용해요.)
4. 설정은 **아무것도 건드리지 말고** **Deploy**를 눌러요.
5. 1분 뒤 축하 화면이 뜨면 `my-ai-office-xxxx.vercel.app` 주소가 생겨요. 🎉
   - 주소 이름은 Project → Settings → Domains에서 바꿀 수 있어요.

> 이제부터 GitHub 파일을 고치면 Vercel이 **자동으로 다시 배포**해요.

## STEP 4. 내 에이전트로 바꾸기 (10분)
1. GitHub 저장소에서 `index.html`을 누르고 오른쪽 위 ✏️(Edit)을 눌러요.
2. 맨 위 `✏️ 여기만 고치면` 부분의 `AGENTS` 목록을 고쳐요.

```js
{ id:"ops", name:"운영봇", role:"운영 매니저", kind:"dog", color:"#f2c46d", shirt:"#6c8cff", seat:"A",
  intro:"일정 관리, 할 일 정리, 회의록 요약을 맡고 있어요.",
  lines:["데모 대사1","데모 대사2","데모 대사3"] },
```

| 항목 | 뜻 |
|---|---|
| `name` | 머리 위 이름표 |
| `role` | 직책 (AI 성격에도 반영돼요) |
| `kind` | 캐릭터 종류: `dog` `cat` `bear` `bunny` `fox` `human` |
| `color` / `shirt` | 얼굴·몸 색 / 옷 색 (색상 코드) |
| `seat` | 앉을 자리 `A`~`L` (바로 아래 `SEATS` 목록 참고) |
| `intro` | 프로필 설명이자 **AI에게 주는 역할 설명** |
| `lines` | AI 연결 전에 나오는 데모 대사 |

- 에이전트를 늘리려면 `{ ... },` 한 덩어리를 복사해서 붙이고 `id`와 `seat`만 겹치지 않게 바꾸면 돼요.
- `MY_NAME = "나"` 부분을 내 이름으로 바꿔도 돼요.
3. **Commit changes**를 누르면 1분 뒤 사이트에 반영돼요.

## STEP 5. 진짜 AI로 대답하게 하기 (선택, 사용한 만큼 과금)
1. https://console.anthropic.com 에 가입하고 **Billing**에서 크레딧을 충전해요. 소액(예: 5달러)이면 충분해요.
2. **Limits**에서 **월 사용 한도**를 꼭 걸어 두세요. (예: 5달러)
3. **API Keys → Create Key**로 키를 만들어 복사해요. (`sk-ant-...`, 남에게 절대 공유 금지)
4. Vercel 프로젝트에서 **Settings → Environment Variables**로 가서 아래 값을 넣어요.
   - Key: `ANTHROPIC_API_KEY`
   - Value: 복사한 키
   - **Save**
5. **Deployments** 탭에서 맨 위 배포의 **⋯ → Redeploy**를 눌러요.
6. 사이트에서 채팅하면 이제 `(데모 답변)` 없이 에이전트가 진짜로 대답해요. 🤖

> 모델을 바꾸고 싶으면 환경변수 `ANTHROPIC_MODEL`을 추가해요. 기본값은 `claude-haiku-4-5`(빠르고 저렴)예요.
> 사용 가능한 모델 이름은 https://docs.claude.com/en/docs/about-claude/models 에서 확인하세요.
> ⚠️ 주소를 아는 사람은 누구나 채팅할 수 있어요. 그래서 2번의 사용 한도가 중요해요.

## STEP 6. Pixel Agents 확장 프로그램 (선택)
이 웹 사무실과는 별개로, VS Code에서 Claude Code 작업을 픽셀 캐릭터로 보고 싶을 때 써요.
1. VS Code를 열고 왼쪽 확장(Extensions) 아이콘을 눌러요.
2. `Pixel Agents`를 검색해서 **Install**해요.
3. Claude Code로 작업을 시작하면 사무실에 캐릭터가 나타나요.

---

### 막히면?
- **배포 후 404 오류**: GitHub에 폴더째 올라간 경우예요. `index.html`이 저장소 첫 화면에 바로 보여야 해요.
- **AI 연결 후에도 데모 답변만 나와요**: 환경변수를 저장한 뒤 **Redeploy**를 했는지 확인하세요. 키 앞뒤 공백도 확인하세요.
- **캐릭터가 이상해요**: `kind` 철자를 확인하세요. 목록에 없는 값이면 귀가 없는 캐릭터로 나와요.

