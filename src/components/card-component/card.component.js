import React, { useState } from 'react';
import styles from './card.module.css';

const Card = ({ team }) => {
  const { name, email, id, img, terra, metal, agua, arvore, fogo } = team || {};
  const imgSrc = img ? `/imagens/${img}` : `https://robohash.org/${id || name}?set=set2&size=180x180`;
  const [flipped, setFlipped] = useState(false);

  const innerClass = flipped ? `${styles.cardInner} ${styles.flipped}` : styles.cardInner;

  return (
    <div className={styles.cardContainer}>
      <div className={innerClass} onClick={() => setFlipped((s) => !s)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped((s) => !s); }}>
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <img
            alt={name ? `${name}` : 'team image'}
            src={imgSrc}
            style={{ width: '100%', height: '500px', objectFit: 'contain' }}
          />
          <h2>{name} &rarr;</h2>
        </div>

        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <h2 className={styles.backTitle}>{name}</h2>
          {terra ? <p>Terra: {terra}</p> : null}
          {metal ? <p>Metal: {metal}</p> : null}
          {agua ? <p>Água: {agua}</p> : null}
          {arvore ? <p>Árvore: {arvore}</p> : null}
          {fogo ? <p>Fogo: {fogo}</p> : null}
          <p style={{ marginTop: 'auto', fontSize: '0.85rem', color: '#666' }}>Clique para voltar</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
