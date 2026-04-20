let posts = JSON.parse(localStorage.getItem('amk_posts')) || [
    { id: 1, author: 'AMK 기술면접관', title: '상태 축소 기법의 실제 적용성', content: '래더 로직 최적화 시 상태 축소 기법을 쓰셨는데, 실제 현장 장비의 실시간 응답속도(Scan Time)에는 어느 정도 영향을 주었나요?', date: '2026-04-10', recommends: 42, replies: ['논리 연산 단계를 약 25% 줄임으로써 스캔 타임을 5ms에서 3ms로 단축시키는 효과를 확인했습니다.'], password: '1111' },
    { id: 2, author: '동료 엔지니어', title: 'SolidWorks 부하 감소 성과 공유 요청', content: '캠 형상 설계로 부하를 15%나 줄이셨다니 대단합니까! 혹시 사용하신 재질 라이브러리 정보를 알 수 있을까요?', date: '2026-04-11', recommends: 28, replies: ['주로 고탄성 알루미늄 합금 데이터셋을 참고하여 보정했습니다. 자세한 수치는 제 산출물 페이지 프로젝트 01을 참고해 주세요!'], password: '1111' },
    { id: 3, author: '현직 선배 엔지니어', title: '포트폴리오 구성 피드백', content: '데이터 로깅 유실률을 0%로 만든 사례가 인명 신뢰성 측면에서 아주 훌륭한 접근입니다. AMK의 가동률 중시 철학과 잘 맞네요.', date: '2026-04-12', recommends: 35, replies: ['격려 감사드립니다! 단순 구현을 넘어 설비 신뢰성을 최우선으로 생각하는 엔지니어가 되겠습니다.'], password: '1111' },
    { id: 4, author: '산업시스템공학 교수', title: '칼만 필터 적용 사례에 대한 질문', content: '반도체 보관 환경 데이터 정제에 칼만 필터를 사용한 점이 흥미롭군요. 노이즈 특성(Q, R값)은 어떻게 튜닝하셨나요?', date: '2026-04-12', recommends: 21, replies: ['초기에는 시행착오가 있었으나, 전력 노이즈의 표준 편차를 실측하여 공분산 행렬을 최적화함으로써 신뢰도를 99.5%까지 높였습니다.'], password: '1111' },
    { id: 5, author: 'AMK HR 담당자', title: '엔지니어 성장 로드맵 인상적입니다', content: '2024년부터 2026년까지의 성장 기록이 매우 체계적이네요. 특히 AI와 하드웨어의 협업 역량이 돋보입니다.', date: '2026-04-13', recommends: 50, replies: ['좋게 봐주셔서 감사합니다! 현장 중심의 AI 활용 능력을 갖춘 엔지니어로 성장하겠습니다.'], password: '1111' },
    { id: 6, author: 'PLC 전문가 그룹', title: '컨베이어 병목 해결 사례 공유', content: '순차 제어에서 상태 축소로 넘어가는 과정의 데이터 분석 결과가 아주 실무적입니다. 실제 공장 자동화 현장에서 귀한 자료네요.', date: '2026-04-13', recommends: 18, replies: ['현장에서의 데이터 로깅이 없었다면 불가능했을 성과였습니다. 감사드립니다!'], password: '1111' },
    { id: 7, author: '누원고 후배', title: '엔지니어 선배님 멋지십니다!', content: '저도 선배님처럼 동양미래대 로봇과에 가서 멋진 엔지니어가 되고 싶습니다. 공부 팁 좀 알려주세요!', date: '2026-04-13', recommends: 12, replies: ['기초 수학과 물리 공부를 탄탄히 하고, 무엇이든 직접 만들어 보는 경험을 추천합니다. 응원할게!'], password: '1111' },
    { id: 8, author: '방문객', title: '웹사이트 레이아웃이 정말 전문적입니다', content: '하이테크 기업의 대시보드를 보는 듯한 디자인이네요. 가독성도 좋고 내용도 알찹니다.', date: '2026-04-13', recommends: 7, replies: [], password: '1111' }
];

function saveToLocalStorage() {
    localStorage.setItem('amk_posts', JSON.stringify(posts));
}

function renderPosts() {
    const list = document.getElementById('boardList');
    if (!list) return;

    list.innerHTML = posts.map((post, index) => `
        <div class="board-row animate-in" onclick="toggleDetails(${post.id})">
            <div>${posts.length - index}</div>
            <div>
                <div style="font-weight: 700; color: #fff;">${post.title} <span style="color: var(--primary-red); font-size: 0.85rem; margin-left:12px;">👍 ${post.recommends || 0} &nbsp; 💬 ${post.replies.length || 0}</span></div>
                <div id="content-${post.id}" style="display: none; margin-top: 15px; color: var(--text-muted); line-height: 1.8;">
                    ${post.content}
                    ${post.replies.map(r => `<div class="reply-box"><strong>답변:</strong> ${r}</div>`).join('')}
                    <div class="btn-group">
                        <button class="small-btn" onclick="event.stopPropagation(); recommendPost(${post.id})">추천</button>
                        <button class="small-btn" onclick="event.stopPropagation(); addReplyPrompt(${post.id})">답변</button>
                        <button class="small-btn" onclick="event.stopPropagation(); openEditModal(${post.id})">수정</button>
                        <button class="small-btn" onclick="event.stopPropagation(); deletePost(${post.id})">삭제</button>
                    </div>
                </div>
            </div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${post.author}</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">${post.date}</div>
        </div>
    `).join('');
}

function toggleDetails(id) {
    const el = document.getElementById(`content-${id}`);
    if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
}

function openModal() {
    const modal = document.getElementById('postModal');
    if (modal) modal.style.display = 'block';
    
    const title = document.getElementById('modalTitle');
    if (title) title.innerText = '새 게시글 작성';
    
    document.getElementById('postId').value = '';
    document.getElementById('postAuthor').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postPassword').value = '';
}

function closeModal() {
    const modal = document.getElementById('postModal');
    if (modal) modal.style.display = 'none';
}

function openEditModal(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const modal = document.getElementById('postModal');
    if (modal) modal.style.display = 'block';
    
    const title = document.getElementById('modalTitle');
    if (title) title.innerText = '게시글 수정';

    document.getElementById('postId').value = post.id;
    document.getElementById('postAuthor').value = post.author;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postPassword').value = ''; // 수정 시에는 비밀번호 확인 용도로 비워둠
    
    // alert를 통해 비밀번호를 입력하라는 안내를 줄 수도 있습니다.
}

function savePost() {
    const id = document.getElementById('postId').value;
    const author = document.getElementById('postAuthor').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const password = document.getElementById('postPassword').value;
    const date = new Date().toISOString().split('T')[0];

    if (!author || !title || !content || !password) {
        alert('모든 필드(비밀번호 포함)를 입력해주세요.');
        return;
    }

    if (id) {
        const idx = posts.findIndex(p => p.id == id);
        if (posts[idx].password !== password) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        posts[idx] = { ...posts[idx], author, title, content };
    } else {
        const newPost = { id: Date.now(), author, title, content, password, date, recommends: 0, replies: [] };
        posts.push(newPost);
    }

    saveToLocalStorage();
    renderPosts();
    closeModal();
}

function deletePost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const inputPw = prompt('비밀번호를 입력하세요:');
    if (inputPw === null) return; // 취소 버튼

    if (post.password === inputPw) {
        if (confirm('정말 삭제하시겠습니까?')) {
            posts = posts.filter(p => p.id !== id);
            saveToLocalStorage();
            renderPosts();
        }
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
}

function addReplyPrompt(id) {
    const reply = prompt('답글을 입력하세요:');
    if (reply) {
        const idx = posts.findIndex(p => p.id === id);
        if (idx !== -1) {
            posts[idx].replies.push(reply);
            saveToLocalStorage();
            renderPosts();
            const contentEl = document.getElementById(`content-${id}`);
            if (contentEl) contentEl.style.display = 'block';
        }
    }
}

function recommendPost(id) {
    const idx = posts.findIndex(p => p.id === id);
    if (idx !== -1) {
        if (!posts[idx].recommends) posts[idx].recommends = 0;
        posts[idx].recommends++;
        saveToLocalStorage();
        renderPosts();
        const contentEl = document.getElementById(`content-${id}`);
        if (contentEl) contentEl.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', renderPosts);
