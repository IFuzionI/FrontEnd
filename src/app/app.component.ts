import { Component } from '@angular/core';
import { Tarefa } from './tarefa';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'TODOapp';
  arrayDeTarefas: Tarefa[] = [];
  apiURL: string;
  usuarioLogado = false;
  tokenJWT = '{ "token":""}';
  mostrarErro = false;

  constructor(private http: HttpClient) {
    this.apiURL = 'https://back-end-6ieu.onrender.com';
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    if (!descricaoNovaTarefa || descricaoNovaTarefa.trim() === '') {
      this.mostrarErro = true;
      return;
    }

    this.mostrarErro = false;
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    this.http
      .post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa)
      .subscribe((resultado) => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  DELETE_tarefa(tarefaASerRemovida: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaASerRemovida);
    var id = this.arrayDeTarefas[indice]._id;
    this.http
      .delete<Tarefa>(`${this.apiURL}/api/delete/${id}`)
      .subscribe((resultado) => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  READ_tarefas() {
    const idToken = new HttpHeaders().set(
      'id-token',
      JSON.parse(this.tokenJWT).token
    );
    this.http
      .get<Tarefa[]>(`${this.apiURL}/api/getAll`, { headers: idToken })
      .subscribe(
        (resultado) => {
          this.arrayDeTarefas = resultado;
          this.usuarioLogado = true;
        },
        (error) => {
          this.usuarioLogado = false;
        }
      );
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var indice = this.arrayDeTarefas.indexOf(tarefaAserModificada);
    var id = this.arrayDeTarefas[indice]._id;
    this.http
      .patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada)
      .subscribe((resultado) => {
        console.log(resultado);
        this.READ_tarefas();
      });
  }

  login(username: string, password: string) {
    var credenciais = { nome: username, senha: password };
    this.http
      .post(`${this.apiURL}/api/login`, credenciais)
      .subscribe((resultado) => {
        this.tokenJWT = JSON.stringify(resultado);
        this.READ_tarefas();
      });
  }
}
