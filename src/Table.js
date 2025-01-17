import React from 'react';
import numeral from 'numeral';
import './Table.css';

function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country,cases}) => (
               <tr>
                   {/* Emmet tr>td*2 */}
                   <td>{country}</td>
                   <td>
                       <strong>{numeral(cases).format("0.0a")}</strong>
                    </td>
               </tr> 
            ))} 
        </div>
    )
}

export default Table
