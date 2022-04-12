import { Component } from 'react';
import styles from './card.module.css';

class Card extends Component {
  render() {
    const { name, email, id, phone } = this.props.monster;
    return (
      <div
        key={id}
        href="https://nextjs.org/docs"
        className={styles.cardContainer}
      >
        <img
          alt={`monster ${name}`}
          src={`https://robohash.org/${id}?set=set2&size=180x180`}
        ></img>
        <h2>{name} &rarr;</h2>
        <p>{phone}</p>
      </div>
    );
  }
}
export default Card;
