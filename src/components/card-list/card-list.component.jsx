import { Component } from 'react';
import styles from '../../../styles/Home.module.css';

class CardList extends Component {
  render() {
    const { monsters } = this.props;
    return (
      <div className={styles.grid}>
        {monsters.map((monster) => {
          return (
            <div
              key={monster.id}
              href="https://nextjs.org/docs"
              className={`${styles.card} card-container`}
            >
              <img
                alt={`monster ${monster.name}`}
                src={`https://robohash.org/${monster.id}?set=set2&size=180x180`}
              ></img>
              <h2>{monster.name} &rarr;</h2>
              <p>{monster.phone}</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default CardList;
