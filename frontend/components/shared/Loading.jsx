
import React from 'react';

function Loading() {
  return (
    <div className='loading'>
      <img
        src='/images/gif/loading-arrow.gif'
        alt='loading gif'
      />
      <h4>Data loading...</h4>
    </div>
  );
}

export default Loading;
