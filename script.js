// Elementos do DOM (verifique se existem para evitar erros)
const form = document.getElementById("doramaForm");
const cancelBtn = document.getElementById("cancelEdit");
let editingIndex = -1;

function loadDoramas() {
  const tableBody = document.getElementById("doramaTableBody");
  if (!tableBody) {
    console.error(
      "Erro: Elemento 'doramaTableBody' não encontrado. Verifique o HTML."
    );
    return;
  }
  const doramas = JSON.parse(localStorage.getItem("doramas")) || [];
  tableBody.innerHTML = ""; // Limpa apenas o tbody
  doramas.forEach((item, index) => {
    console.log(item); // Para depuração
    const row = tableBody.insertRow();

    // Detecta quantas colunas há no thead para adaptar
    const thead = document.querySelector("#doramaTable thead");
    const numColumns = thead ? thead.querySelectorAll("th").length : 6; // Padrão 6 se não encontrar

    // Insere células com base no número de colunas
    if (numColumns >= 5) {
      row.insertCell(0).textContent = item.usuario || "N/A"; // Nome
      row.insertCell(1).textContent = item.dorama || "N/A"; // Título/Dorama
      row.insertCell(2).textContent = item.nota || "N/A"; // Classificação/Nota
      row.insertCell(3).textContent = item.avaliacao || "N/A"; // Comentário/Avaliação
      const actionsCell = row.insertCell(4); // Opções/Ações
      actionsCell.innerHTML = `
        <button class="edit-btn" onclick="editDorama(${index})">Editar</button>
        <button class="delete-btn" onclick="deleteDorama(${index})">Deletar</button>
      `;
    }
    if (numColumns >= 6) {
      const imgCell = row.insertCell(5); // Imagem (se houver coluna)
      imgCell.innerHTML = item.imgBase64
        ? `<img src="${item.imgBase64}" class="miniatura" alt="Imagem do dorama"/>`
        : "Sem imagem";
    }
  });
}

function saveDoramas(doramas) {
  localStorage.setItem("doramas", JSON.stringify(doramas));
  loadDoramas();
}

// Só executa se o formulário existir (páginas com formulário)
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const doramas = JSON.parse(localStorage.getItem("doramas")) || [];

    const imgBase64 = await handleImageUpload();

    const newDorama = {
      usuario: document.getElementById("usuario").value,
      dorama: document.getElementById("dorama").value,
      nota: document.getElementById("nota").value,
      avaliacao: document.getElementById("avaliacao").value,
      imgBase64,
    };
    if (editingIndex === -1) {
      doramas.push(newDorama); // Adiciona novo
    } else {
      doramas[editingIndex] = newDorama; // Edita existente
      editingIndex = -1;
    }
    saveDoramas(doramas);
    form.reset();
    if (cancelBtn) cancelBtn.style.display = "none";
  });
}

// Só executa se o botão cancelar existir
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    form.reset();
    editingIndex = -1;
    cancelBtn.style.display = "none";
  });
}

async function handleImageUpload() {
  const fileInput = document.getElementById("uploadImagem");
  if (!fileInput) return; // Evita erro se não existir

  const file = fileInput.files[0];
  if (!file) {
    alert("Escolha uma imagem primeiro!");
    return;
  }
  const base64 = await fileToBase64(file);
  return base64;
}

// Converte para base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

function editDorama(index) {
  if (!form) return; // Evita erro se não houver formulário
  const doramas = JSON.parse(localStorage.getItem("doramas")) || [];
  const item = doramas[index];
  document.getElementById("usuario").value = item.usuario;
  document.getElementById("dorama").value = item.dorama;
  document.getElementById("nota").value = item.nota;
  document.getElementById("avaliacao").value = item.avaliacao;
  editingIndex = index;
  if (cancelBtn) cancelBtn.style.display = "inline";
}

function deleteDorama(index) {
  const doramas = JSON.parse(localStorage.getItem("doramas")) || [];
  doramas.splice(index, 1);
  saveDoramas(doramas);
}
