class GerenciadorTarefas {
  constructor() {
    this.tarefas = [];
    this.inicializarElementos();
    if (this.elementosCarregados) {
      this.carregarTarefas();
      this.configurarEventos();
    }
  }

  inicializarElementos() {
    this.input = document.getElementById("novaTarefa");
    this.btnAdicionar = document.getElementById("btnAdicionar");
    this.listaTarefas = document.getElementById("listaTarefas");
    this.templateTarefa = document.getElementById("templateTarefa");
    this.semTarefas = document.getElementById("semTarefas");

    this.elementosCarregados = !!(
      this.input &&
      this.btnAdicionar &&
      this.listaTarefas &&
      this.templateTarefa &&
      this.semTarefas
    );

    if (!this.elementosCarregados) {
      console.error(
        "Nem todos os elementos necessários foram encontrados no DOM"
      );
    }
  }

  configurarEventos() {
    this.btnAdicionar.addEventListener("click", () => this.adicionarTarefa());
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.adicionarTarefa();
    });
  }

  carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("tarefas");
    this.tarefas = tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
    this.atualizarInterface();
  }

  salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(this.tarefas));
    this.atualizarInterface();
  }

  adicionarTarefa() {
    const texto = this.input.value.trim();
    if (texto) {
      this.tarefas.push({
        id: Date.now(),
        texto: texto,
        concluida: false,
      });
      this.input.value = "";
      this.salvarTarefas();
    }
  }

  editarTarefa(id) {
    const tarefa = this.tarefas.find((t) => t.id === id);
    if (tarefa) {
      const novoTexto = prompt("Editar tarefa:", tarefa.texto);
      if (novoTexto !== null && novoTexto.trim() !== "") {
        tarefa.texto = novoTexto.trim();
        this.salvarTarefas();
      }
    }
  }

  removerTarefa(id) {
    if (confirm("Tem certeza que deseja remover esta tarefa?")) {
      this.tarefas = this.tarefas.filter((t) => t.id !== id);
      this.salvarTarefas();
    }
  }

  atualizarInterface() {
    if (!this.elementosCarregados) return;

    while (this.listaTarefas.firstChild) {
      if (this.listaTarefas.firstChild === this.semTarefas) {
        break;
      }
      this.listaTarefas.removeChild(this.listaTarefas.firstChild);
    }

    this.semTarefas.style.display =
      this.tarefas.length === 0 ? "block" : "none";

    this.tarefas.forEach((tarefa) => {
      const novoElemento = this.templateTarefa.content.cloneNode(true);

      const spanTexto = novoElemento.querySelector("span");
      if (spanTexto) {
        spanTexto.textContent = tarefa.texto;
      }

      const btnEditar = novoElemento.querySelector(".btnEditar");
      const btnExcluir = novoElemento.querySelector(".btnExcluir");

      if (btnEditar) {
        btnEditar.addEventListener("click", () => this.editarTarefa(tarefa.id));
      }

      if (btnExcluir) {
        btnExcluir.addEventListener("click", () =>
          this.removerTarefa(tarefa.id)
        );
      }

      this.listaTarefas.insertBefore(novoElemento, this.semTarefas);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.gerenciadorTarefas = new GerenciadorTarefas();
});
