import { Version, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'CadastraFornecedoresWebPartStrings';

import { sp } from "@pnp/sp";
import * as $ from "jquery";
import "bootstrap";

//css customizados
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');
require('../../stylelibrary/css/padrao.css');
require('../../stylelibrary/css/toastr.min.css');

//scripts customizados
import toastr from '../../stylelibrary/js/toast/toastr.min.js';
require('../../stylelibrary/js/jquery.inputmask.js');

//classes services e models
import Fornecedor from '../../domain/models/Fornecedor';
import FornecedorService from '../../services/FornecedorService';
import Pais from '../../domain/models/Pais';
import PaisService from '../../services/PaisService';
import Endereco from '../../domain/models/Endereco';
import EnderecoService from '../../services/EnderecoService';

import UtilData from '../../data/util/Utils';
import UtilDomain from '../../domain/util/Utils';

export interface ICadastraFornecedoresWebPartProps {
  description: string;  
}

export default class CadastraFornecedoresWebPart extends BaseClientSideWebPart<ICadastraFornecedoresWebPartProps> {

  private _utilDomain: UtilDomain;
  private _idFornecedor: string;

  //metodo que é disparado ao iniciar a webpart
  public onInit(): Promise<void> {

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
      .getElementById("btnSalvar")
      .addEventListener("click", () => this.SalvarFornecedor());

    //defino o bind das tabs
    $('a[data-toggle="tab"]').on(
      "shown.bs.tab", (e: Event) =>
        this.loadTab(e.target["attributes"]["data-target"].value)
    );

    //adicionado as mascaras
    (<any>$("#txtCNPJ")).inputmask(("99.999.999/9999-99"));
    (<any>$("#txtTelefone")).inputmask(("(99) 99999-9999"));

    //leio a querystring para verificar se é edicao
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    this._idFornecedor = queryParms.getValue("idFornecedor");

    //simulo pageLoad para determinar se é cadastro ou edição
    this.PageLoad(this._idFornecedor, "Load");

  }

  private async PageLoad(idFornecedor: string, origem: string): Promise<void> {

    //obter todos os paises aqui
    await this.ObterTodosPaises();

    if (this._idFornecedor !== undefined) {
      $("#btnExcluir").show();
      await this.CarregarFornecedor(Number(idFornecedor));
      await this.CarregarEndereco(Number(idFornecedor));
    }
    else {
      $("#btnExcluir").hide();
    }

  }

  public async CarregarFornecedor(idFornecedor: number) {

    let fornecedor: Fornecedor = await new FornecedorService().ObterFornecedorPorId(idFornecedor);

    $(`#ddlPaises option[value=${fornecedor.Pais.ID}]`).attr('selected', 'selected');
    $("#txtRazaoSocial").val(fornecedor.Title);
    $("#txtCNPJ").val(fornecedor.CNPJ);
    $("#txtTelefone").val(fornecedor.Telefone);
    $("#txtEmail").val(fornecedor.Email);

  }

  protected async ObterTodosPaises() {
    let montahtmlPaises = "";
    let paises: Pais[];
    paises = await new PaisService().ObterTodosPaises();

    montahtmlPaises = `<option value="">Selecione</option>`;
    paises.forEach(element => {
      montahtmlPaises += `<option value="${element.ID}">${element.Title}</option>`;
    });

    $("#ddlPaises").html(montahtmlPaises);
  }

  protected async loadTab(target: string) {
    switch (target) {
      case "#Detalhes":
        break;
      case "#Endereco":
        this.CarregarEndereco(Number(this._idFornecedor));
        break;
      default:
        break;
    }
  }

  protected async CarregarEndereco(idFornecedor: number) {
    let endereco: Endereco = await new EnderecoService().ObterEnderecoPorFornecedorId(idFornecedor);
    $("#txtEndereco").val(endereco.Title);
    $("#txtCidade").val(endereco.Cidade);
    $(`#ddlEstado option[value=${endereco.Estado}]`).attr('selected', 'selected');
  }

  protected async SalvarFornecedor() {

    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "4000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };

    let razaoSocial = $("#txtRazaoSocial").val().toString();
    let paisID = Number($("#ddlPaises option:selected").val());
    let cnpj = $("#txtCNPJ").val().toString();
    let telefone = $("#txtTelefone").val().toString();
    let email = $("#txtEmail").val().toString();

    let fornecedor: Fornecedor = {
      ID: Number(this._idFornecedor),
      Title: razaoSocial,
      PaisID: paisID,
      CNPJ: cnpj,
      Telefone: telefone,
      Email: email,
      Ativo: true
    };

    let enderecoFornecedor = $("#txtEndereco").val().toString();
    let estado = $("#ddlEstado option:selected").val().toString();
    let cidade = $("#txtCidade").val().toString();

    let endereco: Endereco = {
      Title: enderecoFornecedor,
      Cidade: cidade,
      Estado: estado
    };

    try {

      if (this._idFornecedor === undefined) {
        let idFornecedor = await new FornecedorService().SalvarFornecedor(fornecedor);

        endereco.IDFornecedor = idFornecedor;
        let idEndereco = await new EnderecoService().SalvarEndereco(endereco);

        if (idEndereco > 0) {
          toastr["success"]("Ação realizada com sucesso!", "Sucesso");
          setInterval(() => this._utilDomain.RedirecionarPagina("/SitePages/CadastraFornecedor.aspx?idFornecedor=" + idFornecedor),4000);
        }
      }
      else
      {
        let atualizou: boolean = await new FornecedorService().AtualizarFornecedor(fornecedor);
        if(atualizou) {

          let enderecoUpdate: Endereco = await new EnderecoService().ObterEnderecoPorFornecedorId(Number(this._idFornecedor));
          endereco.ID = enderecoUpdate.ID;
          atualizou = await new EnderecoService().AtualizarEndereco(endereco);

          if(atualizou)
            toastr["success"]("Ação realizada com sucesso!", "Sucesso");
        }
      }

    }
    catch (err) {
      console.log(err);
      if (err === "Fornecedor já cadastrado!")
        toastr["error"]("Fornecedor já cadastrado!", "Erro");
      else
        toastr["error"]("Ocorreu um erro ao realizar o cadastro.", "Erro");
    }
  }

  protected async SalvarEndereco(idFornecedor: number): Promise<number> {
    let enderecoFornecedor = $("#txtEndereco").val().toString();
    let estado = $("#ddlEstado option:selected").val().toString();
    let cidade = $("#txtCidade").val().toString();

    let endereco: Endereco = {
      Title: enderecoFornecedor,
      Cidade: cidade,
      Estado: estado,
      IDFornecedor: idFornecedor
    };

    let idEndereco = await new EnderecoService().SalvarEndereco(endereco);
    return idEndereco;

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
