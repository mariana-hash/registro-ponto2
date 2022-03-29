function mostrarEsconder(mostrar, esconder) {

    document.getElementById(mostrar).style.display = 'block';
    document.getElementById(esconder).style.display = 'none';
    if (mostrar == 'consulta') {
        carregarListaPontos();
    }


}


class Ponto {
    constructor(hora, minuto, dia, mes, ano, entrada) {
        this.hora = hora,
            this.minuto = minuto,
            this.dia = dia,
            this.mes = mes,
            this.ano = ano,
            this.entrada = entrada

    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this == null) {
                return false;
            }
        }
        return true;
    }
}

class BD {
    constructor() {
        let id = localStorage.getItem('id');
        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id');
        proximoId = parseInt(proximoId) + 1;
        return proximoId;
    }
    gravar(p) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(p));
        localStorage.setItem('id', id);
    }
    recuperarTodosRegistros() {
        let pontos = Array();
        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {

            let ponto = JSON.parse(localStorage.getItem(i));

            if (ponto === null) {
                continue;
            }
            pontos.push(ponto);
        }
        return pontos;
    }
    pesquisar(ponto) {
        let pontosFiltrados = Array();

        pontosFiltrados = this.recuperarTodosRegistros();

        if (ponto.ano != '') {
            pontosFiltrados = pontosFiltrados.filter(p => p.ano == ponto.ano);
        }
        if (ponto.mes != '') {
            pontosFiltrados = pontosFiltrados.filter(p => p.mes == ponto.mes);
        }
        if (ponto.entrada != '') {
            pontosFiltrados = pontosFiltrados.filter(p => p.entrada == ponto.entrada);
        }

        return pontosFiltrados;
    }
}

let bd = new BD();

function cadastrarPonto(entrada) {

    let hora = document.getElementById('hora');
    let minuto = document.getElementById('minuto');
    let dia = document.getElementById('dia');
    let mes = document.getElementById('mes');
    let ano = document.getElementById('ano');
    if (hora === null) {
        var data = new Date();
        hora = data.getHours().toString();
        minuto = data.getMinutes().toString();
        if (minuto < 10) {
            minuto = '0' + minuto;
        }
        dia = data.getDate().toString();
        mes = (data.getMonth() + 1).toString();
        ano = data.getFullYear().toString();
    }
    else {
        hora = hora.value;
        minuto = minuto.value;
        dia = dia.value;
        mes = mes.value;
        ano = ano.value;
    }

    let ponto = new Ponto(
        hora,
        minuto,
        dia,
        mes,
        ano,
        entrada
    )

    if (ponto.validarDados()) {
        bd.gravar(ponto);
        document.getElementById('mensagemModal').innerHTML = "Ponto registrado com sucesso <br> hora: " + hora + ":" + minuto +
            "<br> dia: " + dia + "/" + mes
        "<br> tipo: " + entrada

        $('#registroPonto').modal('show');
    }

}

function carregarListaPontos(pontos) {


    var listaPontos = document.getElementById('listaPontos');

    if (pontos == null) {
        pontos = bd.recuperarTodosRegistros();
    }
    else {
        listaPontos.innerHTML = '';
    }



    pontos.forEach(function (p) {
        let linha = listaPontos.insertRow();

        linha.insertCell(0).innerHTML = `${p.dia}/${p.mes}/${p.ano}`;
        linha.insertCell(1).innerHTML = `${p.hora}:${p.minuto}`;
        linha.insertCell(2).innerHTML = p.entrada;
    })

}

function pesquisarPonto() {
    let mes = document.getElementById('mes').value;
    let ano = document.getElementById('ano').value;
    let entrada = document.getElementById('entrada').value;

    let ponto = new Ponto(null, null, null, mes, ano, entrada);

    let pontos = bd.pesquisar(ponto);

    carregarListaPontos(pontos);
}