import { Component } from 'react';
import styles from '../../../styles/Home.module.css';

class CardList extends Component {
  render() {
    const { monsters } = this.props;
    return (
      <div className={styles.grid}>
        {monsters.map((monster) => {
          return (
            <a
              key={monster.id}
              href="https://nextjs.org/docs"
              className={styles.card}
            >
              <h2>{monster.name} &rarr;</h2>
              <p>{monster.phone}</p>
            </a>
          );
        })}
      </div>
    );
  }
}

export default CardList;
