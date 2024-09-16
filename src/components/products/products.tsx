import React from 'react';
import dataService from '../data/data';

export default function Produtos() {

    const data = dataService();

    return (
        <div className="container">
            <h2 className="title">Conheça alguns dos animais mais lindos deste mundo de Deus!!!</h2>
            <div className="horse-list">
                {data.map((horse:any) => (
                    <div key={horse.Id} className="horse-item">
                        <img src={horse.Imagem} alt={`Cavalo ${horse.Id}`} />
                        <p>{horse.Descricao}</p>
                    </div>
                ))}
            </div>

        </div>

    );
}

