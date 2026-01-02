window.Cryptojoke = {

  load({ id, phrase }) {

    const STORAGE_KEY = `cryptojoke_${id}`;
    const CLEAR_FLAG  = `cryptojoke_${id}_cleared`;

    const container = document.getElementById("cryptogram");
    const clearBtn  = document.getElementById("clearBtn");

    function setCookie(name,value,days){
      const d=new Date();
      d.setTime(d.getTime()+days*86400000);
      document.cookie =
        name + "=" + encodeURIComponent(value) +
        ";expires=" + d.toUTCString() +
        ";path=/";
    }

    function getCookie(name){
      const m=document.cookie.match(new RegExp('(^|; )'+name+'=([^;]*)'));
      return m ? decodeURIComponent(m[2]) : "";
    }

    const isCleared = getCookie(CLEAR_FLAG) === "true";
    let saved = {};

    try {
      if(!isCleared){
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      }
    } catch(e){
      saved = {};
    }

    const inputs = [];

    container.innerHTML = "";
    phrase.split(" ").forEach((word,wIndex)=>{
      const wordDiv=document.createElement("div");
      wordDiv.className="word";

      word.split("").forEach((ch,cIndex)=>{
        if(/[A-Z]/.test(ch)){
          const box=document.createElement("div");
          box.className="letterBox";

          const top=document.createElement("div");
          top.className="cipher";
          top.textContent=ch;

          const input=document.createElement("input");
          input.type="text";
          input.maxLength=1;

          const key = `${wIndex}-${cIndex}`;
          if(saved[key]) input.value=saved[key];

          input.oninput=(e)=>{
            e.target.value = e.target.value
              .toUpperCase()
              .replace(/[^A-Z]/g,"")
              .slice(0,1);

            if(e.target.value) saved[key]=e.target.value;
            else delete saved[key];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            setCookie(CLEAR_FLAG,"false",7);
          };

          box.appendChild(top);
          box.appendChild(input);
          wordDiv.appendChild(box);
          inputs.push(input);

        } else {
          const p=document.createElement("div");
          p.className="punct";
          p.textContent=ch;
          wordDiv.appendChild(p);
        }
      });

      container.appendChild(wordDiv);
    });

    clearBtn.onclick = ()=>{
      inputs.forEach(i => i.value = "");
      localStorage.removeItem(STORAGE_KEY);
      setCookie(CLEAR_FLAG,"true",7);
    };
  }
};
