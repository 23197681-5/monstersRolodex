import { Component } from 'react';
import styles from '../../../styles/Home.module.css';
import { Input } from '@chakra-ui/react';
import { componentsStyles } from './search-box.module.css';
class SearchBox extends Component {
  render() {
    return (
      <p className={styles.description}>
        <Input
          className={`search-box ${this.props.cssClass}`}
          type="search"
          htmlSize={4}
          width="320px"
          placeholder={this.props.placeholder}
          onChange={this.props.onChangeHandler}
        />
      </p>
    );
  }
}

export default SearchBox;
