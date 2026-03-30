(function(){
  const allPlayers = Array.isArray(window.AMA_PLAYERS) ? window.AMA_PLAYERS : [];

  function safe(v){
    if(v === undefined || v === null || String(v).trim() === "") return " ";
    return v;
  }

  function item(label, value){
    return `
      <div class="detail">
        <div class="label">${label}</div>
        <div class="value">${safe(value)}</div>
      </div>
    `;
  }

  function instagramItem(id){
    if(!id || !String(id).trim()) return item("인스타 아이디", "없음");
    const clean = String(id).replace("@","").trim();
    return item(
      "인스타 아이디",
      `<span class="insta-wrap">
        <span>@${clean}</span>
        <a class="insta-btn" href="https://www.instagram.com/${clean}/" target="_blank" rel="noopener noreferrer">프로필 방문</a>
      </span>`
    );
  }

  function createGenerationOptions(selectEl){
    if(!selectEl) return;
    let html = `<option value="전체">전체 기수</option>`;
    for(let i = 1; i <= 48; i++){
      html += `<option value="${i}기">${i}기</option>`;
    }
    selectEl.innerHTML = html;
  }

  function shuffleArray(array){
    const newArray = [...array];
    for(let i = newArray.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function openModal(player){
    const modal = document.getElementById("modal");
    const inner = document.getElementById("modalInner");
    if(!modal || !inner) return;

    const isYB = player.group === "YB";

    const leftHtml = `
      <div class="modal-left">
        <img class="modal-img" src="${player.image}" onerror="this.src='https://placehold.co/400x500/1a1f29/ffffff?text=No+Image'">
        <div class="modal-name">${safe(player.name)}</div>
        <div class="modal-sub">${safe(player.generation)} · ${safe(player.position)} · ${safe(player.number)}</div>
        <div class="modal-sub" style="margin-top:10px;">
          <span class="badge ${isYB ? "yb" : "ob"}">${player.group}</span>
        </div>
      </div>
    `;

    let rightHtml = "";

    if(isYB){
      rightHtml = `
        <div class="modal-right">
          ${item("이름, 기수", `${safe(player.name)}, ${safe(player.generation)}`)}
          ${item("나이, 본가", `${safe(player.age)}, ${safe(player.hometown)}`)}
          ${instagramItem(player.instagram)}
          ${item("학과 학번", `${safe(player.department)} ${safe(player.studentId)}`)}
          ${item("MBTI", player.mbti)}
          ${item("등번호, 포지션", `${safe(player.number)}, ${safe(player.position)}`)}
          ${item("좋아하는 축구팀", player.favoriteTeam)}
          ${item("좋아하는 플레이", player.favoritePlay)}
          ${item("롤모델", player.rolemodel)}
          ${item("취미", player.hobby)}
          ${item("좋아하는 노래 추천", player.favoritesong)}
          ${item("주량, 주사", `${safe(player.drinkingCapacity)}, ${safe(player.drinkingHabit)}`)}
          ${item("본인의 장점", player.strength)}
          ${item("본인의 단점", player.weakness)}
          ${item("좋아하는 음식", player.favoriteFood)}
          ${item("이상형", player.idealType)}
          ${item("좌우명", player.motto)}
          ${item("TMI", player.tmi)}
        </div>
      `;
    } else {
      rightHtml = `
        <div class="modal-right">
          ${item("이름, 기수", `${safe(player.name)}, ${safe(player.generation)}`)}
          ${item("나이, 본가", `${safe(player.age)}, ${safe(player.hometown)}`)}
          ${item("학과 학번", `${safe(player.department)} ${safe(player.studentId)}`)}
          ${item("졸업년도", player.graduationYear)}
          ${item("등번호, 포지션", `${safe(player.number)}, ${safe(player.position)}`)}
          ${item("좋아하는 축구팀", player.favoriteTeam)}
          ${item("좋아하는 플레이", player.favoritePlay)}
          ${item("취미", player.hobby)}
          ${item("좋아하는 음식", player.favoriteFood)}
          ${item("좌우명", player.motto)}
          ${item("동아리에서 기억에 남는 순간", player.bestMoment)}
          ${item("후배들에게 한마디", player.messageToJuniors)}
        </div>
      `;
    }

    inner.innerHTML = leftHtml + rightHtml;
    modal.classList.add("show");
  }

  function closeModalOnBackdrop(){
    const modal = document.getElementById("modal");
    if(!modal) return;

    modal.addEventListener("click", (e)=>{
      if(e.target === modal) modal.classList.remove("show");
    });

    window.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") modal.classList.remove("show");
    });
  }

  function renderList(group){
    const grid = document.getElementById("playerGrid");
    const empty = document.getElementById("emptyState");
    const search = document.getElementById("searchInput");
    const generation = document.getElementById("generationSelect");

    if(!grid || !empty || !search || !generation) return;

    const currentGroup = group;

    const baseList = shuffleArray(
      allPlayers.filter(player => player.group === currentGroup)
    );

    function apply(){
      const keyword = search.value.toLowerCase().trim();
      const generationValue = generation.value;

      const list = baseList.filter(player => {
        const generationMatch =
          generationValue === "전체" || player.generation === generationValue;

        const hay = `${safe(player.name)} ${safe(player.department)}`.toLowerCase();
        const searchMatch = keyword === "" || hay.includes(keyword);

        return generationMatch && searchMatch;
      });

      grid.innerHTML = "";

      if(list.length === 0){
        empty.style.display = "block";
        return;
      }

      empty.style.display = "none";

      list.forEach(player => {
        const card = document.createElement("article");
        card.className = "player-card";
        card.innerHTML = `
          <img class="card-image" src="${player.image}" onerror="this.src='https://placehold.co/400x500/1a1f29/ffffff?text=No+Image'">
          <div class="card-body">
            <div class="badge ${currentGroup === "YB" ? "yb" : "ob"}">${currentGroup}</div>
            <div class="player-name">${safe(player.name)}</div>
            <div class="card-info">
              <div>기수 : ${safe(player.generation)}</div>
              <div>학과 : ${safe(player.department)}</div>
            </div>
          </div>
        `;
        card.addEventListener("click", ()=>openModal(player));
        grid.appendChild(card);
      });
    }

    search.addEventListener("input", apply);
    generation.addEventListener("change", apply);

    apply();
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    createGenerationOptions(document.getElementById("generationSelect"));
    closeModalOnBackdrop();

    const pageGroup = document.body.dataset.group;
    if(pageGroup) renderList(pageGroup);
  });
})();