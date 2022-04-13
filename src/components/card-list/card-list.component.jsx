import { Component } from 'react';
import styles from './card-list.module.css';
import Card from '../card-component/card.component';
const CardList = ({ monsters }) => {
  const styleCss = styles.cardList;
  return (
    <div className={styleCss}>
      {monsters.map((monster) => {
        return <Card monster={monster}></Card>;
      })}
    </div>
  );
};

export default CardList;
