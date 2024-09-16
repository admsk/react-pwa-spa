export default interface Fornecedor {
    ID?: number;
    Title: string;
    PaisID: number;
    CNPJ: string;
    Telefone: string;
    Email: string;
    Ativo: boolean;
    Pais?: {
      ID: number,
      Title: string
    };
    URL?: string;
}
