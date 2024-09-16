import React from 'react';
import '../../../src/sidebar.css';
import { Grid } from '@mui/material';



export default function Home() {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={12}>
          <div className="title">
            <p>Este caso de estudo exemplifica duas abordagens de desenvolvimento de aplicações Web: </p>
          </div>
          <div>
            <div className="card">
              <h2>PWA (Progressive Web App)</h2>
              <p>
                Esta abordagem oferece uma experiência similar a apps nativos. Elas funcionam offline,
                são instaláveis na tela inicial e oferecem notificações push, utilizando recursos como
                Service Workers e Web App Manifest. PWAs são rápidas, seguras e responsivas, proporcionando
                uma experiência mais envolvente para os usuários.
              </p>
            </div>
            <div className="card">
              <h2>SPA (Single Page Application)</h2>
              <p>
                Esta abordagem oferece um tipo de aplicação web onde todo o conteúdo é carregado em uma única
                página, permitindo navegação dinâmica sem recarregar a página inteira. As atualizações de conteúdo
                são feitas via JavaScript, geralmente utilizando frameworks como React ou Angular, proporcionando
                uma experiência mais rápida e fluída para o usuário. A interação com o servidor ocorre de forma
                assíncrona, enviando e recebendo dados conforme necessário.
              </p>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}