// import React, { useEffect, useState, useRef } from 'react';
// import * as styles from '../css/Feed.module.css';

// export const renderVoteSelectResult = (data: any, layout: any) => {
//   const x = data[0].x;
//   const y = data[0].y;
//   return (
//     <div>
//       <div>
//         <ul className={styles.vote_ul}>
//           <div>
//             {/* <CanvasJSChart options={options} />
//                    */}
//             {
//               y.map((label: string, idx: number) => {
//                 x[idx] = Math.round(x[idx]);
//                 return (
//                   <div style={{ border: 'solid 1px', borderRadius: '5px', marginBottom: '10px' }}>
//                     <div style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)', width: `${isNaN(x[idx]) ? 0 : x[idx]}%` }}>
//                       <div style={{ whiteSpace: 'nowrap', padding: 2 }}>

//                         <div style={{ textAlign: 'left' }}>
//                           {label} {isNaN(x[idx]) ? 0 : x[idx]}%
//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </ul>
//       </div>
//     </div>
//   )
// }
// }