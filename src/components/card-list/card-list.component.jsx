import { Component } from 'react';
import styles from './card-list.module.css';
import Card from '../card-component/card.component';
class CardList extends Component {
  render() {
    const styleCss = styles.cardList;
    const { monsters } = this.props;
    return (
      <div className={styleCss}>
        {monsters.map((monster) => {
          return <Card monster={monster}></Card>;
        })}
      </div>
    );
  }
}

export default CardList;
