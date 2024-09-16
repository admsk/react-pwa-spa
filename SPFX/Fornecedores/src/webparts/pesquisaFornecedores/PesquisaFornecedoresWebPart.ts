import { Version, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PesquisaFornecedoresWebPartStrings';

import { sp } from "@pnp/sp";
import * as $ from "jquery";
import "bootstrap";

//css customizados
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
require('../../stylelibrary/css/padrao.css');

import FornecedorService from '../../services/FornecedorService';
import UtilDomain from '../../domain/util/Utils';
import Paginacao from '../../domain/util/Paginacao';
import Filtros from '../../domain/util/Filtros';

export interface IPesquisaFornecedoresWebPartProps {
  description: string;
}

export default class PesquisaFornecedoresWebPart extends BaseClientSideWebPart<IPesquisaFornecedoresWebPartProps> {

  private _utilDomain: UtilDomain;
  private _filtros: Filtros = new Filtros();
  private _pageSize: number = 10;
  private _pageNumber: number = 1;
  private _top: string = '10';
  private _p_ID_Anterior: number = 0;
  private _p_ID_Proximo: number = 0;
  private _array_Anterior: number[] = [];
  private _contador = 0;

  //metodo que é disparado ao iniciar a webpart
  public onInit(): Promise<void> {

    this._filtros.URLSite = this.context.pageContext.web.absoluteUrl;
    this._filtros.Top = this._top;
    this._utilDomain = new UtilDomain(this.context.pageContext.web.absoluteUrl,
      this.context.pageContext.web.serverRelativeUrl);

    //configura o contexto do PNP
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {

    //carrego o template do layout
    this.domElement.innerHTML = require("./template.html");

    document
      .getElementById("btnBuscar")
      .addEventListener("click", () => this.Buscar());

    document
      .getElementById("btnAvancar")
      .addEventListener("click", () => this.Proximo());

    document
      .getElementById("btnVoltar")
      .addEventListener("click", () => this.Anterior());

  }

  private ShowHideLoading(show: boolean, container: string) {
    if (show) {
      $(`#${container}`).attr("style", "display:none;");
      $("#carregando").attr("style", "display:block;");
    }
    else {
      $("#carregando").attr("style", "display:none;");
    }
  }

  private Anterior() {
    this._pageNumber -= 1;
    this._contador = this._contador - 1;
    this._filtros.Origem = "Anterior";
    this.Buscar(this._filtros.Origem);
  }

  private Proximo() {
    this._pageNumber += 1;
    this._filtros.Origem = "Proximo";
    this.Buscar(this._filtros.Origem);
  }

  private async Buscar(origem?: string) {

    try {
      this.ShowHideLoading(true, "conteudoBusca");

      //se foi clicado em pesquisar limpo as variaveis   
      if (!origem) {
        this.LimparVariaveis();
        this.resetarArrayAnterior();
      }

      let filter: string = "";

      filter = await this.MontarPesquisa();

      this._filtros.Query = filter;
      this._filtros.PageNumber = this._pageNumber;
      this._filtros.PageSize = this._pageSize;


      this._filtros.P_IDCalculado = (this._filtros.Origem === "Anterior" ? this._array_Anterior[this._contador - 1] : this._p_ID_Proximo);


      let paginacao: Paginacao;
      //efetua a pesquisa
      paginacao = await new FornecedorService().PesquisarFornecedores(this._filtros);

      let queryParms;
      let p_ID_QueryString: number;

      //obtem o ID da proxima página caso exista
      if (paginacao.URL) {
        queryParms = new UrlQueryParameterCollection(decodeURIComponent(paginacao.URL.replace(/\+/g, " ")));
        p_ID_QueryString = Number(queryParms.getValue("p_ID"));

        this._p_ID_Anterior = (this._pageNumber === 1 ? this._array_Anterior[0] : this._array_Anterior[this._contador]);
        this._p_ID_Proximo = paginacao.Fornecedores[paginacao.Fornecedores.length - 1].ID;
        this._filtros.P_IDCalculado = (this._filtros.Origem === "Anterior" ? this._p_ID_Anterior : this._p_ID_Proximo);

      }

      if (this._filtros.Origem !== "Anterior") {
        this._array_Anterior.push(p_ID_QueryString);
        this._contador++;
      }

      if (this._filtros.Origem === "Anterior" && this._pageNumber === 1) {
        this._contador = 1;
        this.resetarArrayAnterior();
      }

      let html = '';

      for (let index = 0; index < paginacao.Fornecedores.length; index++) {
        const item = paginacao.Fornecedores[index];

        html +=
          `<tr><td class="ajusteTextoCentro">${item.Title}</td>` +
          `<td class="ajusteTextoCentro">${item.Pais.Title}</td>` +
          `<td class="ajusteTextoCentro">${item.CNPJ}</td>` +
          `<td class="ajusteTextoCentro">${item.Telefone}</td>` +
          `<td class="ajusteTextoCentro">${item.Email}</td>` +
          `<td class="ajusteTextoCentro">${item.Ativo}</td>` +
          `<td class="text-center ajusteColunaTabela">` +
          `<a href="${this.context.pageContext.web.absoluteUrl}/SitePages/CadastraFornecedor.aspx?idFornecedor=${item.ID}"  data-interception="off" class="link">` +
          `<i class="fas fa-search"></i>` +
          `</a>` +
          `</td>` +
          `</tr>`;
      }

      if (paginacao.Fornecedores.length > 0) {

        $("#tableResultado").empty();
        $("#tableResultado").html(html);
        
        $("#semResultados").attr("style", "display:none;");
        $("#conteudoBusca").attr("style", "display: block;");

      } else {

        $("#semResultados").attr("style", "display:block;");
        $("#conteudoBusca").attr("style", "display: none;");

        this.LimparVariaveis();
      }

      this.ShowHideLoading(false, "conteudoBusca");
      this.TratarPaginador(paginacao);
    }
    catch (err) {
      this.ShowHideLoading(false, "conteudoBusca");
    }

  }

  private async MontarPesquisa(): Promise<string> {
    let filter: string = "";
    let pais = $("#ddlPais").val();
    if (pais !== "") {
      pais = $("#ddlPais option:selected").val();
      filter = `PaisId eq ${pais}`;
    }

    let fornecedor = $("#txtFornecedor").val().toString();
    if (fornecedor !== "" && filter !== "")
      filter += `and substringof('${fornecedor}',Title)`;
    else if (fornecedor !== "")
      filter += `substringof('${fornecedor}',Title)`;

    if (filter !== "")
      filter = "&$filter=" + filter;

    return filter;
  }

  private TratarPaginador(paginacao: Paginacao) {
    let btnAvancar = (<HTMLInputElement>document.getElementById("btnAvancar"));
    let btnVoltar = (<HTMLInputElement>document.getElementById("btnVoltar"));

    if (!paginacao.URL)
      btnAvancar.disabled = true;
    else
      btnAvancar.disabled = false;

    if (this._pageNumber === 1)
      btnVoltar.disabled = true;
    else
      btnVoltar.disabled = false;

  }

  private LimparVariaveis() {
    this._filtros.Origem = "Pesquisa";
    this._filtros.P_ID = 0;
    this._contador = 0;
    this._filtros.P_IDCalculado = 0;
    this._p_ID_Anterior = 0;
    this._p_ID_Proximo = 0;
    this._pageNumber = 1;
    this._array_Anterior.push(0);
  }

    private resetarArrayAnterior() {
    this._p_ID_Anterior = this._array_Anterior[0];
    this._array_Anterior = [];
    this._array_Anterior.push(0);
    if (this._p_ID_Proximo !== 0)
      this._array_Anterior.push(this._p_ID_Proximo);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
