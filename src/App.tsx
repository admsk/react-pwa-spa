import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Container } from '@mui/material';
import Grid from '@mui/material/Grid';


import Home from './components/home/home';
import Layout from './components/layout/layout';
import Errors from './components/error/error';
import Produtos from './components/products/products';


export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Container>
          <Grid container spacing={2} justifyContent="center">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="details" element={<Produtos />} />
                {/* <Route path="about" element={<About />} /> */}
                <Route path="*" element={<Errors />} />
              </Route>
            </Routes>
          </Grid>
        </Container>

      </BrowserRouter>

    </div>
  );
}

