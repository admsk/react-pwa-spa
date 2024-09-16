import { sp, ItemAddResult } from '@pnp/sp';
import Fornecedor from '../domain/models/Fornecedor';
import Paginacao from '../domain/util/Paginacao';
import Filtros from '../domain/util/Filtros';
import Constants from '../domain/util/Constants';
import * as $ from "jquery";

export default class FornecedorRepository {

    public async ObterFornecedorPorId(idFornecedor: number): Promise<Fornecedor> {
        let fornecedor: Fornecedor;

        await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items
          .getById(idFornecedor)
          .select("ID, Title, Pais/Title, Pais/ID, CNPJ, Telefone, Email, Ativo")
          .expand("Pais")
          .get()
          .then(item => {
            fornecedor = item;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return fornecedor;
    }

    public async ObterFornecedorPorCNPJ(cnpj: string): Promise<Fornecedor> {
      let fornecedor: Fornecedor;

      await sp.web.lists
        .getByTitle(Constants.listaFornecedores)
        .items
        .select("ID, Title")
        .filter(`CNPJ eq '${cnpj}'`)
        .get()
        .then(item => {
          fornecedor = item[0];
        })
        .catch(e => {
          console.log("erro", e);
        });

      return fornecedor;
  }

    public async ObterTodosFornecedores(): Promise<Fornecedor[]> {
        let fornecedores: Fornecedor[] = [];

        await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items.top(5000)
          .select("ID, Title")
          .filter(`Ativo eq 1`)
          .get()
          .then(items => {
            fornecedores = items;
          })
          .catch(e => {
            console.log("erro", e);
          });

        return fornecedores;
    }

    public async PesquisarFornecedores(filtros: Filtros): Promise<Paginacao> {

        let fornecedores: Fornecedor[] = [];
        let paginacao: Paginacao = new Paginacao();
        
        const queryParam = `%24skiptoken=Paged%3dTRUE%26p_ID=${filtros.P_IDCalculado}&$top=${filtros.PageSize}`;
        const select = '&$select=ID,Title,CNPJ,Telefone,Email,Ativo,Pais/Title&$expand=Pais';

        console.log(decodeURIComponent(`${filtros.URLSite}/_api/web/lists/getByTitle('Fornecedores')/items?${queryParam}${select}${filtros.Query}`.replace(/\+/g, " ")));

        await $.ajax({
            url: `${filtros.URLSite}/_api/web/lists/getByTitle('Fornecedores')/items?${queryParam}${select}${filtros.Query}`,
            method: 'GET',
            async: false,
            headers: {
                Accept: 'application/json; odata=verbose'
            },
            success: (data) => {
                fornecedores = data.d.results; 
                paginacao.Fornecedores = fornecedores;
                if (data.d.__next) {
                    paginacao.URL = data.d.__next;             
                }  
            },
            error: (errorCode, errorMessage) => {
                console.log('Erro ao recuperar o total de itens. \nError: ' + errorCode + '\nStackTrace: ' + errorMessage);
            }
        });

        return paginacao;
    }

    public async InserirFornecedor(fornecedor: Fornecedor) {

      var inseriu: number = 0;

      await sp.web.lists.getByTitle(Constants.listaFornecedores).items.add({
          Title: fornecedor.Title,
          PaisId: fornecedor.PaisID,
          CNPJ: fornecedor.CNPJ,
          Telefone: fornecedor.Telefone,
          Email: fornecedor.Email,
          Ativo: fornecedor.Ativo

      }).then((iar: ItemAddResult) => {
          inseriu = iar.data.ID;
      })
      .catch(e => {
          console.log("erro", e);
      });

      return inseriu;
  }

  public async AtualizarFornecedor(fornecedor: Fornecedor) {

      var atualizou: boolean = false;
      await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items
          .getById(fornecedor.ID)
          .update({
            Title: fornecedor.Title,
            PaisId: fornecedor.PaisID,
            CNPJ: fornecedor.CNPJ,
            Telefone: fornecedor.Telefone,
            Email: fornecedor.Email,
            Ativo: fornecedor.Ativo
          }).then(() => {
              atualizou = true;
          },
          (err) => {
              console.log(err);
          });

      return atualizou;

  }

  public async ExcluirFornecedor(idFornecedor: number) {
      var apagou: boolean = false;

      await sp.web.lists
          .getByTitle(Constants.listaFornecedores)
          .items.getById(idFornecedor)
          .delete()
          .then(() => {
              apagou = true;
          },
          (err) => {
              console.log(err);
          });

      return apagou;
  }

}
